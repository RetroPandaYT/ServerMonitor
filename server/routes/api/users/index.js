const users = require('express').Router();

const userController = require(APPROOT + '/controllers/UserController')

const bodyParser = require('body-parser')

users.use(bodyParser.json());

users.get('/', (req, res) => {

  response = userController.list(req, res)

})

users.post('/create', (req, res) => {

  response = userController.create(req, res)

})

users.get('/read/:id', (req, res) => {

  let id = req.params.id;
  response = userController.read(req, res, id)

})

users.put('/update/:id', (req, res) => {

  let id = req.params.id;
  response = userController.update(req, res, id)

})

users.delete('/delete/:id', (req, res) => {

  let id = req.params.id;
  response = userController.delete(req, res, id)

})

users.post('/login', (req, res) => {

  response = userController.login(req, res)

})

module.exports = users;
