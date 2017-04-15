var gameRoom = require('./system/gameRoom')
var rooms = []

var gameMatch = require('./system/gameMatcher')
var resBuilder = require('./system/protocol/resBuilder')
var Player = require('./game/player')
var config = require('./config')

// run gamematch at port
gameMatch(config.PORT, rooms, (user, room) => {
    // user = {
    //     socket：socket
    //     userKey：string
    // }
    user.socket.write(resBuilder('matchGame'))
})