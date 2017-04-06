var gameworld = require('../game/gameWorld')
var Player = require('../game/player')
var tcp = require('./net')
var PlayerClient = require('./playerClient')
var config = require('../config')

function gameroom(callback) {
    var playerClients = []

    var net = new tcp(0)

    var gameWorld = new gameworld()
    var lastGameTick = Date.now()
    var isRunning = false

    this.startGame = function () {
        if (!isRunning) {
            setInterval(() => {
                var dt = Date.now() - lastGameTick
                gameWorld.update(dt)
                lastGameTick = Date.now()
            }, 1000 / config.GAME_UPDATE_RATE)
            isRunning = true
        }
    }

    this.preAddUser = function (user) {
        var client = new PlayerClient(user)
        client.connectToGameWorld(gameWorld)
        playerClients[user.userKey] = client
    }

    this.canJoin = function () {
        var length = 0
        for (key in playerClients) {
            length++
        }
        return length < config.GAMEROOM.MAX_PLAYER
    }

    this.getAddress = function () {
        var address = {
            host: config.INTERNET_ADDRESS,
            port: net.address().port
        }
        return address
    }

    // used as callback because it can't get address immediately    
    net.on('listening', (function () {
        callback()
    }).bind(this));
}

module.exports = gameroom