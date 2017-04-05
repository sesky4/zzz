var tcp = require('./net')
var config = require('../config')
var parseMatchRequest = require('./protocol/matchRequest')

module.exports = function (port, newPlayerListener) {
    var net = new tcp(port)
    net.newConnection((c) => {
        c.on('data', (msg) => {
            var request = parseMatchRequest(msg)
            if (!request) {
                return
            }
            if (request == config.ERROR.WRONG_PACKET) {
                c.write('WRONG_PACKET')
                return
            }
            if (request == config.ERROR.VERSION_MISSMATCH) {
                c.write('VERSION_MISSMATCH')
                return
            }

            var player = {
                socket: c,
                userKey: request.userKey
            }
            newPlayerListener(player)
        })
    })

    return this
}