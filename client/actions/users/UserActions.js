import ActionDispatcher from 'actions/ActionDispatcher';

import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

const API = process.env.API_DOMAIN + '/api'

const TokenCookie = process.env.TOKEN_COOKIE

const UserCookie = process.env.USER_COOKIE

const fetchAPI = (url, method, body, callback) => {

  const username = read_cookie(UserCookie)
  const token = read_cookie(TokenCookie)

  const args = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'AuthToken' : token,
      'AuthUser' : username
    }
  }

  if(method != 'GET'){
    args.body = JSON.stringify(body)
  }

  fetch(API + url, args)//fetch
  .then((res) => res.json()) // Transform the data into json
  .then(function(data) {

    callback(data)

  })
  .catch(function() {

    const loginUrl = '/users/login'

    delete_cookie(TokenCookie)
    delete_cookie(UserCookie)

    if(url != loginUrl){
      location.href='/users/login'
    }

  });


}

let UserActions = {


  initUser (init) {

    ActionDispatcher.dispatch({
      type: 'USER_INIT',
      stateChange: init
    })

  },
  loadUsers () {

    fetchAPI('/users', 'GET', {},
      function (data){

        let stateChange = {

          loaded: true,
          users: data.values

        }

        ActionDispatcher.dispatch({
          type: 'USERS_LOAD',
          stateChange: stateChange
        })//dispatch


      }

    )//fetchAPI


  },
  loadUser (id) {

    fetchAPI('/users/read/' + id, 'GET', {},
      function (data){

        let form = {}

        if(data.values.length){
          form = data.values[0]
        }

        let stateChange = {

          loaded: true,
          form: form

        }

        ActionDispatcher.dispatch({
          type: 'USER_LOAD',
          stateChange: stateChange
        })//dispatch


      }

    )//fetchAPI


  },
  createUser (state, history) {

    let stateChange = {
      loaded: true,
      result: ''

    }

    if(state.form){

      fetchAPI('/users/create/', 'POST', {
          form: state.form
        },
        function (data){

          if(data > 0){

            history.push('/users/update/'+data,{ result: 'User created' });

          } else {

            stateChange.result = "Create failed"

            ActionDispatcher.dispatch({
              type: 'USER_CREATE',
              stateChange: stateChange
            })

          }


        }

      )//fetchAPI

    } else {

      stateChange.result = "Form Empty"

      ActionDispatcher.dispatch({
        type: 'USER_CREATE',
        stateChange: stateChange
      })

    }


  },

  updateUser (state) {

    let stateChange = {
      loaded: true,
      result: ''

    }

    if(state.form){

      fetchAPI('/users/update/' + state.form.id , 'PUT', {
          form: state.form
        },
        function (data){

          let result = "Updated"

          if(data < 0){
              result = "Error"

          }

          stateChange.result = result

          ActionDispatcher.dispatch({
            type: 'USER_UPDATE',
            stateChange: stateChange
          })


        }

      )//fetchAPI

    } else {

      stateChange.result = 'Form empty'

      ActionDispatcher.dispatch({
        type: 'USER_UPDATE',
        stateChange: stateChange
      })

    }


  },

  deleteUser (id, state) {

    let stateChange = {
      loaded: true,
      result: ''
    }

    if(id){

      fetchAPI('/users/delete/' + id, 'DELETE', {},
        function (data){

          let result = "Deleted"

          let newusers = state.users;

          if(data < 0){
              result = "Error"
          } else {

            newusers = []

            state.users.forEach(function(element) {
                if(element.id != id){
                  newusers.push(element)
                }
            })

          }

          stateChange.result = result

          stateChange.users = newusers

          ActionDispatcher.dispatch({
            type: 'USER_DELETE',
            stateChange: stateChange,
            replace: 'users'
          })

        }

      )

    } else {

      stateChange.result = "No ID specified"
      ActionDispatcher.dispatch({
        type: 'USER_DELETE',
        stateChange: stateChange
      })

    }


  },

  updateUserInput (name, value) {

    let stateChange = {
      form: {[name]: value}

    }

    ActionDispatcher.dispatch({
      type: 'USER_UPDATE_INPUT',
      stateChange: stateChange
    })

  },
  loginUser (state, history) {

    let stateChange = {
      loaded: true,
      result: ''
    }

    if(state.form.username){

      fetchAPI('/users/login', 'POST', {
          form: state.form
        },
        function (data){

            bake_cookie(TokenCookie, data)
            bake_cookie(UserCookie, state.form.username)

            if(data && data != -1){
              history.push('/users/list/')
            } else {

              stateChange.result = "Username or password incorrect"
              ActionDispatcher.dispatch({
                type: 'USER_LOGIN',
                stateChange: stateChange
              })

            }
        }

      )

    } else {

      stateChange.result = 'Username Empty'

      ActionDispatcher.dispatch({
        type: 'USER_LOGIN',
        stateChange: stateChange
      })

    }


  },
  logoutUser (history) {

      delete_cookie(TokenCookie)
      delete_cookie(UserCookie)
      history.push('/users/login/', { result: 'Logged out' })


  }


}//useractions




export default UserActions;
