module.exports = {

  success (res, msg, data) {

    if(!msg){
      msg = 'success'
    }

    if(data){
      console.log("success")
      console.log(data)
    }


    res.status(200).json(msg)

  },

  error (res, msg, err){

    if(!msg){
      msg = 'error'
    }

    if(err){
      console.log("error")
      console.log(err, err.stack)
    }


    res.status(500).json(msg)

  },

  unauthorized(res, msg, debug){

    if(!msg){
      msg = 'unauthorized'
    }

    if(debug){
      console.log("unauthed")
      console.log(debug)
    }


    res.status(401).json(msg)

  }

}
