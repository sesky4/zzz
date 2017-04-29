var net = require('net')

function tcp(port) {
    var server = net.createServer()
    server.listen(port)

    // add error handler
    server.on('error', () => {})

    this.on = function (event, listener) {
        server.on(event, listener)
    }

    this.address = function () {
        return server.address()
    }

    this.newConnection = function (listener) {
        server.on('connection', listener)
    }
}

module.exports = tcp