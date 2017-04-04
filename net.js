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
module.exports = net