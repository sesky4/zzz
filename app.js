var gameRoom = require('./system/gameRoom')
var rooms = []

var gameMatch = require('./system/gameMatcher')
var matchRes = require('./system/protocol/matchResponse')
var Player = require('./game/player')

// run gamematch at port 3000
gameMatch(3000, rooms, (user, room) => {
    // user = {
    //     socket：socket
    //     userKey：string
    // }
    user.socket.write(matchRes(room.getAddress().host, room.getAddress().port).toString())
})