require('dotenv').config()

var path = require('path')

global.APPROOT = path.resolve(__dirname)

const cors = require('cors')

const express = require('express')

const auth = require(APPROOT + '/middleware/AuthMiddleware')

const app = express()

const routes = require(APPROOT + '/routes')

app.use(
  cors(
    {
      origin: process.env.CORS_ALLOW,
      allowedHeaders: [
        'Accept',
        'Content-Type',
        'AuthToken',
        'AuthUser'
      ]
    }
  )
)

const authWhitelist = [
  '/api/users/login',
  '/api/monitor/notify'
]

//allows all sub urls
const authWhitelistInclusive = [
]

app.use('/', auth(authWhitelist, authWhitelistInclusive))

app.use('/', routes)

/*

app.use(express.static('public'))

const jwt = require('jwt-simple');
const secret = process.env.SECRET

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())




app.use('/', routes);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post('/createUser', (req, res) => {
  store
    .createUser({
      username: req.body.username,
      password: req.body.password
    })
    .then(() => res.sendStatus(200))
})
app.post('/login', (req, res) => {
  store
    .authenticate({
      username: req.body.username,
      password: req.body.password
    })
    .then(({ success }) => {
      if (success) res.sendStatus(200)
      else res.sendStatus(401)
    })
})

app.post('/api/users', (req, res) => {

  console.log(req);


  res.send(decoded);

});

app.get('/api/injson', (req, res) => {


  // Return them as json
  var data = [1, 2, 3, 4, 6];
  res.json(data);

  console.log('Sent in json');

});

app.get('/api/set_token', (req, res) => {

  var payload = { foo: 'bar' };
  var token = jwt.encode(payload, secret);

  res.json(token);

});

app.post('/api/get_token', (req, res) => {

  console.log(req);

  var token = req.body.token;

  var decoded = jwt.decode(token, secret);

  res.send(decoded);

});



// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {

  res.sendFile(path.join(__dirname+'/client/build/index.html'));

});*/

app.listen(process.env.PORT, () => {
  console.log('Server running on http://localhost:7555')
})
