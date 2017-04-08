var tcp = require('./net')
var config = require('../config')
var parseMatchRequest = require('./protocol/matchRequest')
var newGameRoom = require('./gameRoom')

function gameMatcher(port, rooms, matchListener) {
    // matchListener(player, room)
    var net = new tcp(port)
    net.newConnection((c) => {
        c.on('data', (msg) => {
            vaildMatchRequest(msg, (req, err) => {
                if (err) {
                    c.write(err)
                    return
                }

                var user = {
                    socket: c,
                    userKey: req.userKey
                }

                var room = findAvailableRoom(rooms)
                if (!room) {
                    newGameRoom(() => {
                        console.log('create new room')

                        this.startGame()
                        rooms.push(this)

                        this.preAddUser(user)
                        matchListener(user, this)
                    })
                } else {
                    console.log('find exist room')

                    room.preAddUser(user)
                    matchListener(user, room)
                }
            })
        })
    })

    function vaildMatchRequest(msg, callback) {
        // callback(request, err)
        var request = parseMatchRequest(msg)
        if (!request) {
            callback(null, 'WRONG_PACKET')
            return
        }
        if (request == config.ERROR.WRONG_PACKET) {
            callback(null, 'WRONG_PACKET')
            return
        }
        if (request == config.ERROR.VERSION_MISSMATCH) {
            callback(null, 'VERSION_MISSMATCH')
            return
        }
        callback(request, null)
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