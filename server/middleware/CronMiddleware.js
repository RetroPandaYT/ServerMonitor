module.exports = function() {

  return function(req, res, next) {

      const ev = req.apiGateway.event

      const cronJob = ev.cronJob

      switch(cronJob) {
          case '/monitor/broadcast':

              const monitorController = require(APPROOT + '/controllers/MonitorController')

              monitorController.broadcast(req, res)

              break;
          default:
              next()
      }




  }

}
