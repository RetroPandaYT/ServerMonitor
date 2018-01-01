
const AWS = require('aws-sdk')
const yaml = require('js-yaml')
const fs = require('fs')
const responder = require(APPROOT + '/helpers/Responder.js')
const BreakPromiseError = require(APPROOT + '/helpers/BreakPromiseError.js')
const knexHelper = require(APPROOT + '/helpers/KnexHelper.js')

/*
function initKnex(){
  return require('knex')(require('../knexfile')) //need to specify relatively for migrationsion: { ...details... }
}*/

/*
//log actual sql output
knex.on( 'query', function( queryData ) {
    console.log( queryData )
})
*/

module.exports = {

  notify (req, res) {

    knex = knexHelper.init()

    /*inner function step 1*/
    const stepOne = () => {

      console.log('stepOne')
      return new Promise((resolve) => {

        const name = req.body.name
        const server = req.body.server
        const msg = req.body.msg

        resolve(

          knex.select('id', 'is_resolved', 'sent_cnt', 'server')
          .from('monitor')
          .where('name', '=', name)
          .andWhere('server', '=', server)
          .andWhere('msg', '=', msg)
          .limit(1)

        )
      })
    }

    /*inner function step 2*/
    const stepTwo = (values) => {

      console.log('stepTwo')
      return new Promise((resolve) => {

        if(values.length){

          const id = values[0].id
          const is_resolved = values[0].is_resolved
          const sent_cnt = values[0].sent_cnt + 1

          const upload = {
            id: id,
            sent_cnt: sent_cnt
          }

          //reset notice
          if(is_resolved){
            upload.is_resolved = 0
            upload.is_suppressed = 0
            upload.sent_cnt = 0
          }

          // Using trx as a transaction object:

          resolve(
            knex('monitor')
              .where('id', '=', id)
              .update(upload)
          )

        } else {

          resolve(
            knex.insert(req.body)
              .into('monitor')
              .then( (insert_output) => {

                console.log("INSERT OUTPUT")
                console.log(insert_output)

                return {insert_output: insert_output}

              })
          )

        }//if values.length update, else insert

      })//Promise
    }//stepTwo


    stepOne()
    .then(stepTwo)
    .then( () => {
      console.log("SUCCESS")

      responder.success(res, 1)
    })
    .catch( (error) =>  {

      if (error instanceof BreakPromiseError) {
        console.log('break promise error reached')
        responder.success(res, 1)

      } else {

        responder.error(res, -1, error)
      }

    })
    .then( () => {
      knexHelper.destroy()
    })


  }, //notify

  update (req, res, id) {

    knex = knexHelper.init()

    let resolved = req.body.resolved
    let is_suppressed = 0

    if(resolved == 1){

      resolved = 0

    } else {
      resolved = 1
      is_suppressed = 1
    }

    let payload = {
      is_resolved: resolved,
      is_suppressed: is_suppressed
    }

    // Using trx as a transaction object:
    knex.transaction(function(trx) {

      knex('monitor')
      .where('id', '=', id)
      .update(payload)
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

    //id = 0

    const stepOne = () => {

      return new Promise((resolve) => {

        knex = knexHelper.init()

        resolve(

          knex

        )
      })
    }

    const stepTwo = (knex) => {

      return new Promise((resolve) => {

        resolve(

            knex('monitor')
            .where('id', '=', id)
            .del()
        )
      })
    }

    stepOne()
    .then(stepTwo)
    .then( () => {

      responder.success(res, 1)
    })
    .catch(function(err) {

      responder.error(res, -1, err)

    })
    .then( () => {

      knexHelper.destroy()
    })






  },

  list(req, res, page){

    knex = knexHelper.init()

    /*inner function step 1*/
    const stepOne = () => {

      console.log('stepOne')
      return new Promise((resolve) => {

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

                  resolve({
                    page_count: page_count,
                    values: values
                  })

                })

            }

          })//then

        })//Promise

      }//stepOne

      stepOne()
      .then( (payload) => {

        console.log("SUCCESS")

        responder.success(res, payload)

      })
      .catch( (error) =>  {

        responder.error(res, -1, error)

      })
      .then( () => {
        knexHelper.destroy()
      })

  },

  broadcast (req, res) {

    knex = knexHelper.init()

      /*inner function step 1*/
      const getMessages = () => {
        console.log('get message')
        return new Promise((resolve) => {
          resolve(

            knex.select('id', 'name', 'server', 'msg')
              .from('monitor')
              .orderBy('server')
              .orderBy('name')
              .orderBy('msg')
              .where('is_resolved', 0)
              .andWhere('is_suppressed', 0)

          )
        })
      }

      /*inner function step 2*/
      const constructEmail = (messages) => {
        console.log('construct email')
        console.log(messages)

        if(!messages.length){
          console.log('hey, messages are empty')
          throw new BreakPromiseError('messages empty')
        } else {

          let body_text = ''
          let body_html = ''
          let server = ''
          let name = ''
          let msg = ''

          const templates = yaml.safeLoad(fs.readFileSync(APPROOT + '/templates/email/broadcast.yml', 'utf8'))
          const template = templates["default"]
          const subject = template["subject"]
          const sms_text = template["sms_text"]

          let email_text = template["email_text"]
          let email_html = template["email_html"]
          let email_part = ''


          let message_ids = []

          messages.forEach(function (item) {

            message_ids.push(item.id)

            server = item.server
            name = item.name
            msg = item.msg

            email_part = email_text
            email_part = email_part.replace('{server}', server)
            email_part = email_part.replace('{name}', name)
            email_part = email_part.replace('{msg}', msg)

            body_text += email_part

            email_part = email_html
            email_part = email_part.replace('{server}', server)
            email_part = email_part.replace('{name}', name)
            email_part = email_part.replace('{msg}', msg)

            body_html += email_part

          })

          return new Promise((resolve) => {
            resolve(
              {
                body_text: body_text,
                body_html: body_html,
                subject: subject,
                sms_text: sms_text,
                message_ids: message_ids
              }
            )
          })

        }//if messages.length

      }

      /*inner function step 3*/
      const updateMessages = (payload) => {
          console.log('update messages')

          return new Promise( (resolve) => {
            resolve(

              knex('monitor')
              .whereIn('id', payload.message_ids)
              .update({is_suppressed: 1})
              .then( () => {
                  return payload
                }
              )

            )
          })
      }

      /*inner function step 4*/
      const collectContacts = (payload) => {
        console.log('collect contacts')

        let emails = []
        let smss = []

        return new Promise( (resolve) => {
          resolve(

            knex.select('username', 'sms')
              .from('user')
              .where('is_receiving', 1)
              .then(function (users) {

                users.forEach(function (item) {

                  emails.push(item.username)

                  sms = item.sms
                  if(sms.length){
                    smss.push(sms)
                  }

                })

                if(!emails.length){

                  throw new BreakPromiseError('no emails to send to')

                } else {

                  payload.emails = emails
                  payload.smss = smss

                  return payload
                }

              })

          )
        })
      }

      /*inner function step 5*/
      const sendEmails = (payload) => {
        console.log('send emails')

        const ses = new AWS.SES()
        const from = process.env.FROM_ADDRESS
        const body_html = payload.body_html
        const body_text = payload.body_text
        const emails = payload.emails
        const smss = payload.smss
        const subject = payload.subject
        const sms_text = payload.sms_text

        let params = {
          Destination: {
            ToAddresses: emails
          },
          Message: {
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data:
                  body_html
              },
              Text: {
                Charset: 'UTF-8',
                Data: body_text
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: subject
            }
          },
          ReturnPath: from,
          Source: from
        }

        console.log("PARAMS ARE:")
        console.log(params)
        
        ses.sendEmail(params, (err, data) => {

          if (err){
            console.log('send err')
            throw err

          }

          console.log("EMAIL SENT!")
          console.log(emails)

        })//ses.sendEmail

        if(!smss.length){

          throw new BreakPromiseError('smss empty')

        } else {

          params.Destination.ToAddresses = smss
          params.Message.Body.Html.Data = sms_text
          params.Message.Body.Text.Data = sms_text

          ses.sendEmail(params, (err, data) => {

            if (err){

              throw err

            } else {

              throw new BreakPromiseError('smss sent, we made it all the way to the end')

            }

          })//ses.sendEmail (smss)

        }//if smss.length

      }



      getMessages()
      .then(constructEmail)
      .then(updateMessages)
      .then(collectContacts)
      .then(sendEmails)
      .catch( (error) =>  {

        if (error instanceof BreakPromiseError) {
          console.log('break promise error reached')
          responder.success(res)

        } else {

          responder.error(res, '', error)
        }

      })
      .then( () => {
        knexHelper.destroy()
      })

    }

}

/*trx example

// Using trx as a transaction object:
knex.transaction(function(trx) {

  knex.select('id', 'name', 'server', 'msg')
    .from('monitor')
    .orderBy('server')
    .orderBy('name')
    .orderBy('msg')
    .where('is_resolved', 0)
    .andWhere('is_suppressed', 0)
    .transacting(trx)
    .then(function(messages) {
      return thenConstructEmail(messages)
    })
    .then(function(props) {
      return thenUpdateMessages(props)
    })
    .then(function(props) {
      return thenSelectUsers(props)
    })
    .then(function(props) {
      return thenSendEmails(props)
    })
    .then(function(props) {
      return thenSendSMS(props)
    })

    .then(trx.commit)
    .catch(trx.rollback)


})
.then(function(inserts) {
  console.log('transaction successful')
})
.catch(function(error) {
  console.log('transaction failed')
  console.error(error)
})
*/
