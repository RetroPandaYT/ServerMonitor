/*process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../app');



chai.use(chaiHttp);

describe('API Routes', function() {

});
*/

require('dotenv').config()

const path = require('path')
global.APPROOT = path.resolve(__dirname) + "/../"

const express = require('express')
const app = express()
const routes = require('../routes')
app.use('/', routes)
app.listen(process.env.PORT, () => {})

const knexHelper = require('../helpers/KnexHelper.js')

process.env.NODE_ENV = 'test';



const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

let login_details = {
  'username': 'todd.lekan@gmail.com',
  'password': 'password'
}

let register_details = {
  'form': {
    'username': 'username',
    'password': '123@abc',
    'sms': '123@abc',
  }
};



describe('Create Account, Login and Check Token', () => {
  beforeEach((done) => {
    // Reset user mode before each test

    let knex = require('knex')(require('../knexfile'))

    knex = knexHelper.init()

    knex('user')
    .del()
    .then( () => {

      console.log('users cleared')
      done()

    })
    .catch(function(err) {

      console.log(err)

    })

  });

  describe('/POST Create User', () => {
    it('it should create a user', (done) => {
      chai.request(app)
        .post('/api/users/create')
        .send(register_details) // this is like sending $http.post or this.http.post in Angular
        .end((err, res) => { // when we get a response from the endpoint
          // in other words,
          // the res object should have a status of 201
          console.log('status?')
          res.should.have.status(200);
          // the property, res.body.state, we expect it to be true.
          console.log(res.body)
          expect(res.body).to.be.a('number');

          done(); // Don't forget the done callback to indicate we're done!

        })
    })
  })//describe
})


/*  describe('/POST Create User', () => {
    it('it should create a user', (done) => {
      chai.request(server)
        .post('/api/user/create')
        .send(register_details) // this is like sending $http.post or this.http.post in Angular
        .end((err, res) => { // when we get a response from the endpoint
          // in other words,
          // the res object should have a status of 201
          res.should.have.status(201);
          // the property, res.body.state, we expect it to be true.
          expect(res.body.state).to.be.true;

          // follow up with login
          chai.request(server)
            .post('/api/v1/auth/login')
            .send(login_details)
            .end((err, res) => {
              console.log('this was run the login part');
              res.should.have.status(200);
              expect(res.body.state).to.be.true;
              res.body.should.have.property('token');

              let token = res.body.token;
              // follow up with requesting user protected page
              chai.request(server)
                .get('/api/v1/account/user')
                // we set the auth header with our token
                .set('Authorization', token)
                .end((err, res) => {
                  res.should.have.status(200);
                  expect(res.body.state).to.be.true;
                  res.body.data.should.be.an('object');

                  done(); // Don't forget the done callback to indicate we're done!
                })
            })

        })
    })
  })//describe
*/
