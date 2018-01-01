const monitor = require('express').Router();

const monitorController = require(APPROOT + '/controllers/MonitorController')

const bodyParser = require('body-parser')

monitor.use(bodyParser.json());

monitor.get('/list/:page', (req, res) => {

  let page = req.params.page;
  monitorController.list(req, res, page)

})

monitor.post('/notify', (req, res) => {

  monitorController.notify(req, res)

})


monitor.put('/update/:id', (req, res) => {

  let id = req.params.id;
  monitorController.update(req, res, id)

})

monitor.put('/delete/:id', (req, res) => {

  let id = req.params.id;
  monitorController.delete(req, res, id)

})

monitor.get('/broadcast', (req, res) => {

  monitorController.broadcast(req, res)

})

monitor.get('/broadcast1', (req, res) => {

  monitorController.broadcast1(req, res)

})

module.exports = monitor;
