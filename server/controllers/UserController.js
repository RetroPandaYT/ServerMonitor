const crypto = require('crypto')
const jwt = require('jwt-simple')
const responder = require(APPROOT + '/helpers/Responder.js')
const knexHelper = require(APPROOT + '/helpers/KnexHelper.js')

/*
//log actual sql output
knex.on( 'query', function( queryData ) {
    console.log( queryData )
})
*/

module.exports = {

  create (req, res) {

    knex = knexHelper.init()

    let username = req.body.form.username
    let password = req.body.form.password
    let sms = req.body.form.sms
    let is_receiving = req.body.form.is_receiving

    // Using trx as a transaction object:
    knex.transaction(function(trx) {

      const { salt, hash } = saltHashPassword({ password })

      knex.insert({username, encrypted_password: hash, salt, sms, is_receiving}, 'id')
        .into('user')
        .transacting(trx)
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .then(function(inserts) {

      let output = 0

      if(inserts.length){
          output = inserts[0]
      }

      responder.success(res, output, inserts)

    })
    .catch(function(err) {

      responder.error(res, -1, err)

    })
    .then( () => {
      knexHelper.destroy()
    })

  },

  read(req, res, id){

    knex = knexHelper.init()

    knex.select('id', 'username', 'sms', 'is_receiving').from('user').where('id', '=', id).then(function (values) {

      responder.success(res, { values }, '')

    }).catch(function(err) {

      responder.error(res, '', err)

    })
    .then( () => {
      knexHelper.destroy()
    })

  },

  update (req, res, id) {

    knex = knexHelper.init()

    let username = req.body.form.username
    let password = req.body.form.password
    let sms = req.body.form.sms
    let is_receiving = req.body.form.is_receiving

    let upload = {username, sms}

    if(password){

      const { salt, hash } = saltHashPassword({ password })

      upload = {username, sms, salt, encrypted_password: hash, is_receiving}

    }

    // Using trx as a transaction object:
    knex.transaction(function(trx) {

      knex('user')
      .where('id', '=', id)
      .update(upload)
      .into('user')
      .transacting(trx)
      .then(trx.commit)
      .catch(trx.rollback)

    })
    .then(function(inserts) {

      responder.success(res, 1, inserts)

    })
    .catch(function(err) {

      responder.error(res, -1, err)

    })
    .then( () => {
      knexHelper.destroy()
    })

  },

  delete (req, res, id) {

    knex = knexHelper.init()

    //id = 0

    // Using trx as a transaction object:
    knex.transaction(function(trx) {

      knex('user')
      .where('id', '=', id)
      .delete()
      .transacting(trx)
      .then(trx.commit)
      .catch(trx.rollback)

    })
    .then(function(inserts) {

      responder.success(res, 1, inserts)

    })
    .catch(function(err) {

      responder.error(res, -1, err)

    })
    .then( () => {
      knexHelper.destroy()
    })

  },

  list(req, res){

    knex = knexHelper.init()

    knex.select('id', 'username').from('user').then(function (values) {

      responder.success(res, { values }, '')

    }).catch(function(err) {

      responder.error(res, '', err)

    })
    .then( () => {
      knexHelper.destroy()
    })

  },

  login(req, res){

    let username = req.body.form.username
    let password = req.body.form.password

    authenticate({
      username: username,
      password: password
    })
    .then(({ success }) => {

      const secret = process.env.SECRET
      let payload = ''
      let token = ''

      if (success){

        payload = { username: username, time: Date.now() }
        token = jwt.encode(payload, secret)

        responder.success(res, token, '')

      } else {

        const superUser = process.env.SUPER_USER
        const superPassword = process.env.SUPER_PASSWORD

        if(username == superUser && password == superPassword){

          payload = { username: superUser, time: Date.now() }
          token = jwt.encode(payload, secret)

          responder.success(res, token, '')

        } else {

          responder.unauthorized(res, -1, '')

        }
      }

    })

  }



}

function authenticate ({ username, password }) {

  knex = knexHelper.init()

  return knex('user').where({ username })
    .then(([user]) => {

      knexHelper.destroy()

      if (!user) return { success: false }
      const { hash } = saltHashPassword({
        password,
        salt: user.salt
      })


      return { success: hash === user.encrypted_password }

    })
}

function saltHashPassword ({
    password,
    salt = randomString()
  })
{

  const hash = crypto
    .createHmac('sha512', salt)
    .update(password)
  return {
    salt,
    hash: hash.digest('hex')
  }

}

function randomString () {
  return crypto.randomBytes(4).toString('hex')
}
