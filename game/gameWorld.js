var config = require('../config')
var quadtree = require('simple-quadtree')
var uuid = require('uuid/v4')

function gameWorld() {
    this.startTime = Date.now()
    this.map = config.MAP
    this.players = [];
    this.foods = [];
    this.bullets = [];
    this.tree = quadtree(0, 0, this.map.width, this.map.height)
    this.eventListener = {}

    setInterval(() => {
        this.triggerEvent('syncPlayer', {
            players: this.players
        })
    }, 1000 / config.NET_UPDATE_RATE)

    // setInterval(() => {
    //     this.triggerEvent('syncBullet', {
    //         bullets: bullets
    //     })
    // }, 1000 / config.NET_UPDATE_RATE)
}

gameWorld.prototype.update = function (dt) {
    bullets = []
    for (var index in this.players) {
        this.players[index].updatePosition(dt, this.map)
        this.players[index].updateBullets(dt, this.map)
        bullets = bullets.concat(this.players[index].getBullets())
    }

    this.checkCollision()
}

gameWorld.prototype.checkCollision = function () {
    // build treee
    this.tree.clear()
    this.players.map((player) => {
        if (player.alive) {
            this.tree.put(player)
        }
    })
    // check collision
    this.bullets.map((bullet) => {
        var possiblePlayer = this.tree.get(bullet)
        if (possiblePlayer.length == 0) {
            return
        }
        for (var i in possiblePlayer) {
            var player = possiblePlayer[i]
            if (bullet.ownerId != player.id) {
                if (isCollision(player, bullet)) {
                    player.hurt(bullet)
                    bullet.removeSelf()
                }
            }
        }

    })
}

function isCollision(player, bullet) {
    var dis = Math.pow(Math.pow((player.y - bullet.y), 2) + Math.pow((player.x - bullet.x), 2), 0.5)
    return dis < player.radius
}

gameWorld.prototype.addPlayer = function (player) {
    if (!this.getPlayerById(player.id)) {
        this.players.push(player)
        this.triggerEvent('playerJoin', this.players)


        player.on('playerDead', (data) => {
            this.triggerEvent('playerDead', data)
        })
        player.on('bulletBirth', (data) => {
            this.triggerEvent('bulletBirth', data)
        })
        player.on('bulletDestory', (data) => {
            this.triggerEvent('bulletDestory', data)
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

gameWorld.prototype.getPlayerByTag = function (tag) {
    for (var index in this.players) {
        if (this.players[index].tag == tag) {
            return this.players[index]
        }
        return null
    }
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

    var speedX = speed.x * config.PLAYER.MAX_SPEED
    var speedY = speed.y * config.PLAYER.MAX_SPEED

    if (Math.pow(speedX * speedX + speedY * speedY, 0.5) <= config.PLAYER.MAX_SPEED) {
        p.speed.x = speedX
        p.speed.y = speedY
    }
}

gameWorld.prototype.on = function (event, listener) {
    if (!this.eventListener[event]) {
        this.eventListener[event] = []
    }
    this.eventListener[event].push(listener)
}

gameWorld.prototype.triggerEvent = function (event, data) {
    if (this.eventListener[event]) {
        // call them
        for (var eventId in this.eventListener[event]) {
            this.eventListener[event][eventId](data)
        }
    }
}

// game instructions
gameWorld.prototype.makeFire = function (playerId, angle) {
    var p = this.getPlayerById(playerId)
    if (p) {
        var rad = angle * Math.PI / 180
        var dirX = config.PLAYER.BULLET.MAX_SPEED * Math.cos(rad)
        var dirY = config.PLAYER.BULLET.MAX_SPEED * Math.sin(rad)

        p.fire({
            x: dirX,
            y: dirY,
            id: uuid()
        })
    }
}
module.exports = gameWorld