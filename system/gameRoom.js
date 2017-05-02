var gameworld = require('../game/gameWorld')
var Player = require('../game/player')
var PlayerClient = require('./playerClient')
var config = require('../config')

function gameroom() {
    console.log("create new room")
    this.playerClients = []
    this.gameWorld = new gameworld()

    this.lastGameTick = Date.now()
    this.isRunning = false

    this.timerUpdate = null
    this.startGame()

    this.gameWorld.on('gameOver', () => {
        this.destroy()
    })
}

gameroom.prototype.startGame = function () {
    if (!this.isRunning) {
        this.timerUpdate = setInterval(() => {
            var dt = (Date.now() - this.lastGameTick) / 1000
            this.gameWorld.update(dt)
            this.lastGameTick = Date.now()
        }, 1000 / config.GAME_UPDATE_RATE)
        this.isRunning = true
    }
}

gameroom.prototype.addUser = function (user) {
    if (!this.playerClients[user.userKey]) {
        var client = new PlayerClient(user)
        client.connectToGameWorld(this.gameWorld)
        this.playerClients[user.userKey] = client
    }
}

gameroom.prototype.canJoin = function () {
    var length = 0
    for (var key in this.playerClients) {
        length++
    }
    return length < config.GAMEROOM.MAX_PLAYER
}

gameroom.prototype.destroy = function () {
    for (var i in this.playerClients) {
        this.playerClients[i].close()
    }
    this.gameWorld = null
    this.playerClients = []
    clearInterval(this.timerUpdate)
    this.onDestroy()
}
module.exports = gameroom