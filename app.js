var gameRoom = require('./system/gameRoom')
var rooms = []

var gameMatch = require('./system/gameMatcher')
var resBuilder = require('./system/protocol/resBuilder')
var Player = require('./game/player')

// run gamematch at port 3000
gameMatch(3000, rooms, (user, room) => {
    // user = {
    //     socket：socket
    //     userKey：string
    // }
    user.socket.write(resBuilder('matchGame'))
})