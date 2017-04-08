var protocolParse = function () {}

module.exports = function (socket) {
    var listeners = {}

    socket.on('data', (data) => {
        // todo: add a buffer to buff the data because TCP
        // is stream based.The data may not be a completed
        // protocol message.
        var protocol = protocolParse(data)
        // var listenerArray = listeners[protocol.type]
        var listenerArray = listeners['playerJoin']

        if (listenerArray) {
            for (var eventId in listenerArray) {
                listenerArray[eventId](protocol)
            }
        }
    })

    this.on = (event, listener) => {
        if (!listeners[event]) {
            listeners[event] = []
        }
        listeners[event].push(listener)
    }
}