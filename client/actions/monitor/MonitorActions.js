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
  .catch(function(error) {

    //console.log('error')
    //console.log(error)

    const loginUrl = '/users/login'

    delete_cookie(TokenCookie)
    delete_cookie(UserCookie)

    if(url != loginUrl){
      //console.log('redirect to login')
      location.href='/users/login'
    }

  });


}

let MonitorActions = {

  init (init) {

    ActionDispatcher.dispatch({
      type: 'MONITOR_INIT',
      stateChange: init
    })

  },
  list (page) {

    fetchAPI('/monitor/list/' + page, 'GET', {},
      function (data){

        let stateChange = {

          loaded: true,
          list: data.values,
          pageCount: data.page_count,
          activePage: page

        }

        ActionDispatcher.dispatch({
          type: 'MONITOR_LIST',
          stateChange: stateChange,
          replace: 'list'
        })//dispatch


      }

    )//fetchAPI

  },

  resolve (id, resolved, state) {

    let stateChange = {
      loaded: true,
      result: ''

    }

    fetchAPI('/monitor/update/' + id, 'PUT', {
        resolved: resolved
      },
      function (data){

        let result = "Updated"

        if(data < 0){
            result = "Error"

        }

        stateChange.result = result

        let newList = state.list;

        if(data < 0){
            result = "Error"
        } else {

          newList = []

          state.list.forEach(function(element) {
              if(element.id != id){
                newList.push(element)
              }
          })

        }

        stateChange.list = newList
        
        ActionDispatcher.dispatch({
          type: 'MONITOR_UPDATE',
          stateChange: stateChange,
          replace: 'list'
        })


      }

    )//fetchAPI

  },

  delete (id, state) {

    let stateChange = {
      loaded: true,
      result: ''
    }

    if(id){

      fetchAPI('/monitor/delete/' + id, 'DELETE', {},
        function (data){

          let result = "Deleted"

          let newList = state.list;

          if(data < 0){
              result = "Error"
          } else {

            newList = []

            state.list.forEach(function(element) {
                if(element.id != id){
                  newList.push(element)
                }
            })

          }

          stateChange.result = result

          stateChange.list = newList

          ActionDispatcher.dispatch({
            type: 'MONITOR_DELETE',
            stateChange: stateChange,
            replace: 'list'
          })

        }

      )

    } else {

      stateChange.result = "No ID specified"
      ActionDispatcher.dispatch({
        type: 'MONITOR_DELETE',
        stateChange: stateChange
      })

    }


  }
}//useractions




export default MonitorActions;
