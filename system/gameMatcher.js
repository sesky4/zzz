var tcp = require('./net')
var config = require('../config')
var gameRoom = require('./gameRoom')
var reqParser = require('./protocol/reqParser')
var resBuiler = require('./protocol/resBuilder')

function gameMatcher(port, rooms, matchListener) {
    // matchListener(player, room)
    var net = new tcp(port)
    net.newConnection((c) => {
        console.log('a new connection')
        c.on('data', onMatch)
        c.on('error', () => {})
        // while (1) {
        //     c.write('1')
        // }
    })

    function onMatch(msg) {
        var that = this
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
            that.removeListener('data', onMatch)
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