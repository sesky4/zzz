var gameMatch = require('./system/gameMatcher')
var config = require('./config')

var rooms = []
// run gamematch at port
gameMatch(config.PORT, rooms)