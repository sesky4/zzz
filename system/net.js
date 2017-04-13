var dgram = require('dgram')

function net(host, port) {
    var socket = dgram.createSocket('udp4')
    socket.bind(port, host)
    this.socket = socket

    socket.on('listening', function () {
        var address = socket.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    this.on = function (event, listener) {
        socket.on(event, listener)
    }

    this.send = function (data, ip, port) {
        socket.send(data, ip, port)
    }

    this.address = function () {
        return socket.address()
    }
}

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