var config = require('../config')
var quadtree = require('simple-quadtree')

function gameWorld() {
    var startTime = Date.now()
    var map = {
        width: 5000,
        height: 5000
    }
    var players = [];
    var foods = [];
    var bullets = [];
    var tree = quadtree(0, 0, map.width, map.height)

    this.eventListener = {}

    this.update = function (dt) {
        bullets = []
        for (var index in players) {
            players[index].updatePosition(dt, map)
            players[index].updateBullets(dt, map)

            bullets = bullets.concat(players[index].getBullets())
        }

        this.checkCollision()
    }

    this.checkCollision = function () {
        var that = this
        // build treee
        tree.clear()
        players.map(tree.put)
        // check collision
        bullets.map(((bullet) => {
            var possiblePlayer = tree.get(bullet)
            if (possiblePlayer.length == 0) {
                return
            }
            for (var i in possiblePlayer) {
                var player = possiblePlayer[i]
                if (bullet.ownerId != player.id) {
                    if (isCollision(player, bullet)) {
                        bullet.removeSelf()
                        that.triggerEvent('playerDead', player)
                    }
                }
            }

        }).bind(this))
    }

    function isCollision(player, bullet) {
        var dis = Math.pow(Math.pow((player.y - bullet.y), 2) + Math.pow((player.x - bullet.x), 2), 0.5)
        return dis < player.radius
    }

    this.addPlayer = function (player) {
        if (!this.getPlayerById(player.id)) {
            players.push(player)
            this.triggerEvent('playerJoin', players)


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

    this.removePlayer = function (playerId) {
        // delete player
        for (var i in players) {
            if (players[i].id = playerId) {
                plsyers.splice(i, 1)
            }
        }
        this.triggerEvent('playerLeft', playerId)
    }

    this.getPlayerByTag = function (tag) {
        for (var index in this.players) {
            if (this.players[index].tag == tag) {
                return this.players[index]
            }
            return null
        }
    }

    this.getPlayerById = function (id) {
        for (var i in players) {
            if (players[i].id == id) {
                return players[i]
            }
        }
        return null
    }

    this.setPlayerSpeed = function (playerId, speed) {
        var p = this.getPlayerById(playerId)
        if (!p) {
            return;
        }

        var speedX = speed.x
        var speedY = speed.y

        if (Math.pow(speedX * speedX + speedY * speedY, 0.5) <= config.PLAYER.MAX_SPEED) {
            p.speed.x = speedX
            p.speed.y = speedY
        }
    }

    this.on = (function (event, listener) {
        if (!this.eventListener[event]) {
            this.eventListener[event] = []
        }
        this.eventListener[event].push(listener)
    }).bind(this)

    this.triggerEvent = (function (event, data) {
        if (this.eventListener[event]) {
            // call them
            for (var eventId in this.eventListener[event]) {
                this.eventListener[event][eventId](data)
            }
        }
    }).bind(this)

    // game instructions
    this.makeFire = function (playerId, angle, bulletId) {
        var p = this.getPlayerById(playerId)
        if (p) {
            var rad = angle * Math.PI / 180
            var dirX = config.PLAYER.BULLET.MAX_SPEED * Math.cos(rad)
            var dirY = config.PLAYER.BULLET.MAX_SPEED * Math.sin(rad)

            p.fire({
                x: dirX,
                y: dirY,
                id: bulletId
            })
        }
    }

    setInterval(() => {
        this.triggerEvent('syncPlayer', {
            players: players
        })
    }, 1000 / config.NET_UPDATE_RATE)

    // setInterval(() => {
    //     this.triggerEvent('syncBullet', {
    //         bullets: bullets
    //     })
    // }, 1000 / config.NET_UPDATE_RATE)
}

module.exports = gameWorld