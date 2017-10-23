const routes = require('express').Router()

const users = require(APPROOT + '/routes/api/users')

const monitor = require(APPROOT + '/routes/api/monitor')

routes.use('/api/users', users)

routes.use('/api/monitor', monitor)

module.exports = routes
