var config = require('../config')
var quadtree = require('simple-quadtree')
var uuid = require('uuid/v4')
var injector = require('../eventHandlerInjector')
var foodManager = require('./foodManager')
var randomEvent = require('./randomEvent')

function gameWorld() {
    this.startTime = Date.now()
    this.players = [];
    this.foodManager = new foodManager(this)
    this.tree = quadtree(0, 0, config.MAP.width, config.MAP.height)
    this.leaderBoard = []
    this.randomEvent = new randomEvent(this)

    this.timerId = []

    this.timerId.push(setInterval(this.syncPlayers.bind(this), 1000 / config.NET_UPDATE_RATE))

    this.timerId.push(setInterval(this.updateLeaderBoard.bind(this), 1000 / config.LEADERBOARD_UPDATE_RATE))

    this.foodManager.on('foodBirth', (food) => {
        this.triggerEvent('foodBirth', food)
    })
    this.foodManager.on('foodDestroy', (food) => {
        this.triggerEvent('foodDestroy', food)
    })
}

injector.inject(gameWorld)

gameWorld.prototype.syncPlayers = function () {
    this.triggerEvent('syncPlayer', {
        players: this.players
    })
}

gameWorld.prototype.updateLeaderBoard = function () {
    console.log('haha')
    this.generateLeaderBoard()
    // and remain game time
    this.triggerEvent('leaderBoardUpdate', {
        leaderBoard: this.leaderBoard,
        leftTime: config.EVERY_GAME_TIME - (Date.now() - this.startTime) / 1000
    })
}

gameWorld.prototype.getFoods = function () {
    return this.foodManager.getFoods()
}

gameWorld.prototype.update = function (dt) {
    if (this.gameOver()) {
        this.triggerEvent('gameOver', this.leaderBoard)
        this.destroy()
        return
    }

    this.buildQuadTree()
    this.randomEvent.update()
    for (var index in this.players) {
        this.players[index].update(dt)
    }

    this.foodManager.update(dt)
}

gameWorld.prototype.buildQuadTree = function () {
    this.tree.clear()
    this.players.map((player) => {
        if (player.alive) {
            this.tree.put(player)
        }
    })
}

gameWorld.prototype.addPlayer = function (player) {
    if (!this.getPlayerById(player.id)) {
        this.players.push(player)
        player.gameWorld = this
        this.triggerEvent('playerJoin', this.players)


        player.on('playerDead', (player) => {
            this.triggerEvent('playerDead', player)
        })
        player.on('playerAffected', (player) => {
            this.triggerEvent('playerAffected', player)
        })
        player.on('bulletBirth', (data) => {
            this.triggerEvent('bulletBirth', data)
        })
        player.on('bulletDestroy', (data) => {
            this.triggerEvent('bulletDestroy', data)
        })
    }
}

gameWorld.prototype.removePlayer = function (playerId) {
    // delete player
    for (var i in this.players) {
        if (this.players[i].id = playerId) {
            this.players.splice(i, 1)
        }
    }
    this.triggerEvent('playerLeft', playerId)
}

gameWorld.prototype.getPlayerById = function (id) {
    for (var i in this.players) {
        if (this.players[i].id == id) {
            return this.players[i]
        }
    }
    return null
}

gameWorld.prototype.setPlayerSpeed = function (playerId, speed) {
    var p = this.getPlayerById(playerId)
    if (!p) {
        return;
    }

    var speedX = speed.x
    var speedY = speed.y

    if (Math.pow(speedX * speedX + speedY * speedY, 0.5) <= 1) {
        p.speed(speedX, speedY)
    }
}

// game instructions
gameWorld.prototype.makeFire = function (playerId, angle) {
    var p = this.getPlayerById(playerId)
    if (p) {
        p.fire(angle)
    }
}

// add reborn in player model
gameWorld.prototype.rebornPlayer = function (playerId) {
    var p = this.getPlayerById(playerId)
    p.reborn()
    this.triggerEvent('playerReborn', playerId)
}

gameWorld.prototype.generateLeaderBoard = function () {
    var unsort = this.players.map((p) => {
        return {
            name: p.name,
            score: p.score
        }
    })
    this.leaderBoard = unsort.sort((a, b) => {
        if (a.score > b.score) {
            return -1;
        } else {
            return 1;
        }
    })
}

gameWorld.prototype.getAllPlayers = function () {
    return this.players
}

gameWorld.prototype.gameOver = function () {
    return config.EVERY_GAME_TIME - (Date.now() - this.startTime) / 1000 < 0
}

gameWorld.prototype.destroy = function () {
    for (var i in this.timerId) {
        clearInterval(this.timerId[i])
    }
}
module.exports = gameWorld