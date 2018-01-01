/*load env vars*/
require('dotenv').config()

/*boot express*/
const express = require('express')
const app = express()

/*set root path*/
const path = require('path')
global.APPROOT = path.resolve(__dirname)

/*load headers for lambda*/
if(process.env.NODE_ENV !== 'development'){

  const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
  app.use(awsServerlessExpressMiddleware.eventContext())

}

/*check cron for lambda*/
if(process.env.NODE_ENV !== 'development'){

  const cron = require(APPROOT + '/middleware/CronMiddleware')
  app.use('/', cron())

}

/*check cors*/
const cors = require('cors')
const cors_allow = process.env.CORS_ALLOW
let cors_allow_arr = cors_allow.split(',')
app.use(
  cors(
    {
      origin: cors_allow_arr,
      methods: 'GET,PUT,POST,DELETE',
      allowedHeaders: [
        'Accept',
        'Content-Type',
        'AuthToken',
        'AuthUser'
      ]
    }
  )
)

/*check authorization*/
const auth = require(APPROOT + '/middleware/AuthMiddleware')
const authWhitelist = [
  '/api/users/login',
  '/api/monitor/notify',
  '/api/monitor/broadcast',
  '/api/monitor/broadcast1'

]
const authWhitelistInclusive = [
]
app.use('/', auth(authWhitelist, authWhitelistInclusive))

/*set routes*/
const routes = require(APPROOT + '/routes')
app.use('/', routes)

/*launch app*/
if(process.env.NODE_ENV == 'development'){

  app.listen(process.env.PORT, () => {})

} else {

  module.exports = app;//for lambda

}
