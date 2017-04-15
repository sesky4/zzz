var tcp = require('./net')
var config = require('../config')
var gameRoom = require('./gameRoom')
var reqParser = require('./protocol/reqParser')
var resBuiler = require('./protocol/resBuilder')
var bb = require('./byteBuffer')

function gameMatcher(port, rooms, matchListener) {
    // matchListener(player, room)
    var net = new tcp(port)
    var buffer = new bb()

    net.newConnection((c) => {
        console.log('a new connection')
        c.on('data', onData)
        c.on('error', () => {})
    })

    function onData(data) {
        buffer.append(data)
        var p
        while (p = getPacket(buffer)) {
            onMatch(this, p)
        }
    }

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

    function onMatch(that, msg) {
        // var that = this
        vaildMatchRequest(msg, (req, err) => {
            if (err) {
                that.write(resBuiler('error', err))
                return
            }

            var user = {
                socket: that,
                userKey: req.userKey
            }

            var room = findAvailableRoom(rooms)
            if (!room) {
                room = new gameRoom()
                room.startGame()
                rooms.push(room)
            }
            room.preAddUser(user)
            matchListener(user, room)
            that.removeListener('data', onData)
        })
    }

    function vaildMatchRequest(msg, callback) {
        var protocol = reqParser(msg)

        /* callback(protocol, err) */
        if (protocol.error) {
            callback(null, protocol)
            return
        }
        if (protocol.type != 'matchRequest') {
            callback(null, 'Not a matchRequest')
            return
        }
        callback(protocol, null)

    }

    function findAvailableRoom(rooms) {
        for (var i in rooms) {
            var room = rooms[i]
            if (room.canJoin()) {
                return room
            }
        }
        return null
    }
}

module.exports = gameMatcher