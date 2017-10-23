const monitor = require('express').Router();

const monitorController = require(APPROOT + '/controllers/MonitorController')

const bodyParser = require('body-parser')

monitor.use(bodyParser.json());

monitor.get('/list/:page', (req, res) => {

  let page = req.params.page;
  response = monitorController.list(req, res, page)

})

monitor.post('/notify', (req, res) => {

  response = monitorController.notify(req, res)

})


monitor.put('/update/:id', (req, res) => {

  let id = req.params.id;
  response = monitorController.update(req, res, id)

})

monitor.delete('/delete/:id', (req, res) => {

  let id = req.params.id;
  response = monitorController.delete(req, res, id)

})

module.exports = monitor;
