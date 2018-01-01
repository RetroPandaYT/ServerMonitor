const users = require('express').Router();

const userController = require(APPROOT + '/controllers/UserController')

const bodyParser = require('body-parser')

users.use(bodyParser.json());

users.get('/', (req, res) => {

  userController.list(req, res)

})

users.post('/create', (req, res) => {

  userController.create(req, res)

})

users.get('/read/:id', (req, res) => {

  let id = req.params.id;
  userController.read(req, res, id)

})

users.put('/update/:id', (req, res) => {

  let id = req.params.id;
  userController.update(req, res, id)

})

users.put('/delete/:id', (req, res) => {

  let id = req.params.id;
  userController.delete(req, res, id)

})

users.post('/login', (req, res) => {

  userController.login(req, res)

})

module.exports = users;
