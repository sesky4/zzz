var reqParser = require('./protocol/reqParser')
var resBuilder = require('./protocol/resBuilder')
var bb = require('./byteBuffer')

module.exports = function (socket) {
    var listeners = {}
    var buffer = new bb()

    socket.on('error', () => {})
    socket.on('data', (data) => {
        // todo: add a buffer to buff the data because TCP
        // is stream based.The data may not be a completed
        // protocol message.

        buffer.append(data)
        var p
        while (p = getPacket(buffer)) {
            var protocol = reqParser(p)
            if (protocol.error) {
                socket.write(resBuilder('error', protocol))
            }
            var listenerArray = listeners[protocol.type]
            // var listenerArray = listeners['connectRequest']

            if (listenerArray) {
                for (var eventId in listenerArray) {
                    listenerArray[eventId](protocol)
                }
            }
        }

    })

    function getPacket(buf) {
        var length = buf.read(2)
        if (length != null) {
            length = length.readInt16LE()
        }
        if (length > 0 && length < 65536) {
            var packet = buf.read(length + 2)
            if (packet != null) {
                buf.readAndRemove(length + 2)
                return packet.slice(2, packet.length)
            } else {
                return null
            }
        }
    }

    this.on = (event, listener) => {
        if (!listeners[event]) {
            listeners[event] = []
        }
        listeners[event].push(listener)
    }
}