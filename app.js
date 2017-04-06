var gameRoom = require('./system/gameRoom')
var rooms = []

var gameMatch = require('./system/gameMatcher')
var Player = require('./game/player')

// run gamematch at port 3000
gameMatch(3000, rooms, (user, room) => {
    room.preAddUser(user)
    rooms.push(room)
    room.startGame()
    user.socket.write('port ' + room.getAddress().port)
})