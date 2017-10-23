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

    if(!auth){
      if(whitelist.indexOf(req.originalUrl) > -1){

        auth = true

      } else {

        const username = req.get('AuthUser')
        const token = req.get('AuthToken')

        if(token && token != -1 && username){

          const secret = process.env.SECRET
          const ms = process.env.TOKEN_DURATION_SECONDS * 1000

          const decoded = jwt.decode(token, secret)

          const now = Date.now()

          const expires = decoded.time + ms

          if(decoded.username == username && expires > now) {

            auth = true

          }

        }

      }

    }

    if(!auth) {

      return res.sendStatus(401)

    } else {

      next()

    }


  }
}
