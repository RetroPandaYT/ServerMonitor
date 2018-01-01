let conn = null

module.exports = {

  getConn () {
    return conn
  },

  init () {

    conn = require('knex')(require('../knexfile')) //need to specify relatively for migrations



    return conn

  },

  destroy(){
    console.log('destroy?')
    if(conn){
      console.log('conn')

      if(conn.client){

        console.log('client')
        console.log('destroy!')
        conn.destroy()
        conn = null

      }
    }
  }

}
