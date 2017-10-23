const knex = require('knex')(require('../knexfile')) //need to specify relatively for migrations

/*
//log actual sql output
knex.on( 'query', function( queryData ) {
    console.log( queryData )
})
*/

module.exports = {

  notify (req, res) {

    const name = req.body.name
    const server = req.body.server
    const msg = req.body.msg

    //{"name":"value1", "server":"value2", "msg":"value3"}
    //check if notification exists

    knex.select('id', 'is_resolved', 'sent_cnt')
    .from('monitor')
    .where('name', '=', name)
    .andWhere('server', '=', server)
    .andWhere('msg', '=', msg)
    .limit(1)
    .then(function (values) {

      if(values.length){

        const id = values[0].id
        const sent_cnt = values[0].sent_cnt + 1

        const upload = {
          id: id,
          sent_cnt: sent_cnt
        }

        // Using trx as a transaction object:
        knex('monitor')
          .where('id', '=', id)
          .update(upload)
          .then(function(inserts) {

            res.status(200).json(1)
          })
          .catch(function(error) {

            console.log(error)
            res.status(200).json(-1)

          })

      } else {

        knex.insert(req.body)
          .into('monitor')
          .then(function(data) {

            res.status(200).json(1)

          })
          .catch(function(error) {

            console.log(error)

            res.status(200).json(-1)

          })
      }

    })
    .catch(function(err) {

        console.log(err)

      }
    ) //catch

  }, //notify

  update (req, res, id) {

    let resolved = req.body.resolved

    if(resolved == 1){
      resolved = 0
    } else {
      resolved = 1
    }

    // Using trx as a transaction object:
    knex.transaction(function(trx) {

      knex('monitor')
      .where('id', '=', id)
      .update({is_resolved: resolved})
      .transacting(trx)
      .then(trx.commit)
      .catch(trx.rollback)

    })
    .then(function(inserts) {

      res.status(200).json(1)

    })
    .catch(function(error) {

      console.log(error)
      res.status(200).json(-1)

    })


  },

  delete (req, res, id) {

    //id = 0

    knex('monitor')
    .where('id', '=', id)
    .del()
    .then(function(deleted) {

      console.log(deleted)

      res.status(200).json(1)

    })
    .catch(function(error) {

      console.log(error)
      res.status(200).json(-1)

    })


  },

  list(req, res, page){

    const limit = 5

    let offset = 0

    if(!page){
      page = 1
    }

    if(page > 1){
      offset = limit * page
    }


    knex('monitor')
      .count('* as cnt')
      .then(function (values) {

        if(values.length){

          const cnt = values[0].cnt

          const page_count = Math.floor(cnt / limit)

          knex.select('id', 'name', 'server', 'msg', 'is_resolved', 'sent_cnt')
            .from('monitor')
            .orderBy('is_resolved')
            .orderBy('sent_cnt', 'desc')
            .orderBy('server')
            .orderBy('name')
            .orderBy('msg')
            .limit(limit).offset(offset)
            .then(function (values) {

              res.status(200).json({
                page_count: page_count,
                values: values
              })

            }).catch(function(err) {

              console.log(err)

            })

        }

      }).catch(function(err) {

        console.log(err)

      })



  }


}
