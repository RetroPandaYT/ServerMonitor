const jwt = require('jwt-simple')

module.exports = function(whitelist, whitelistInclusive) {

  return function(req, res, next) {

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    let auth = false

    for (var i in whitelistInclusive) {

      if(req.originalUrl.indexOf(whitelistInclusive[i]) == 0){
        auth = true;
      }
      break;

    }

    let username = ''
    let token = ''

    if(!auth){
      if(whitelist.indexOf(req.originalUrl) > -1){

        auth = true

      } else {

        //for lambda
        if(process.env.NODE_ENV !== 'development'){

          const ev = req.apiGateway.event
          username = ev.headers.authuser
          token = ev.headers.authtoken

        } else {

          username = req.get('AuthUser')
          token = req.get('AuthToken')

        }//if process dev

        if(token && token != -1 && username){

          const secret = process.env.SECRET
          const ms = process.env.TOKEN_DURATION_SECONDS * 1000

          const decoded = jwt.decode(token, secret)

          const now = Date.now()

          const expires = decoded.time + ms

          if(decoded.username == username && expires > now) {

            auth = true

          }//if decoded

        }//if(token && token != -1 && username)

      }

    }

    if(!auth) {

      if(username == process.env.SUPER_USER && password == SUPER_PASSWORD){

        auth = true

      }

    }

    if(!auth) {

      return res.sendStatus(401)


    } else {

      next()

    }


  }
}
