var config = require('../../config')
var injector = require('../../eventHandlerInjector')
var uuid = require('uuid/v4')

function zombieBullet(owner, angle) {
    var rad = angle * Math.PI / 180
    var dirX = config.BULLET.ZOMBIE_BULLET.MAX_SPEED * Math.cos(rad)
    var dirY = config.BULLET.ZOMBIE_BULLET.MAX_SPEED * Math.sin(rad)

    this.type = 'zombieBullet'
    this.id = uuid()
    this.owner = owner
    this.playerId = owner.owner.id
    this.startX = owner.owner.x
    this.startY = owner.owner.y
    this.maxDistance = 0
    this.speedX = dirX
    this.speedY = dirY
    this.x = owner.owner.x
    this.y = owner.owner.y
    this.radius = 1
    // weight and height is necessary for quadtree
    this.w = config.BULLET.ZOMBIE_BULLET.W
    this.h = config.BULLET.ZOMBIE_BULLET.H

    this.createTime = Date.now()
    this.damage = 500
}

zombieBullet.prototype.destroy = function () {
    this.triggerEvent('bulletDestroy', this)
}

zombieBullet.prototype.update = function (dt) {
    var limitRange = config.MAP

    this.x += this.speedX * dt
    this.y += this.speedY * dt

    var xMin = -limitRange.width / 2
    var xMax = limitRange.width / 2
    var yMin = -limitRange.height / 2
    var yMax = limitRange.height / 2

    this.x = Math.min(this.x, xMax)
    this.x = Math.max(this.x, xMin)
    this.y = Math.min(this.y, yMax)
    this.y = Math.max(this.y, yMin)
    if (Math.pow(Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2), 0.5) > this.maxDistance) {
        // check effect only once
        var players = this.getGameWorld().getAllPlayers()
        for (var i in players) {
            if (players[i].id != this.owner.owner.id && this.collision(players[i]) && !players[i].immutable) {
                if (players[i].role == 'jelly' && players[i].alive) {
                    this.affect(players[i])
                } else if (players[i].role == 'zombie' && players[i].alive) {
                    this.hurt(players[i])
                }
                // break
                // don't break here cause it can affect more than one people within one attach
            }
        }
        this.destroy()
    }
}

zombieBullet.prototype.affect = function (player) {
    player.hurt(this)
}

zombieBullet.prototype.hurt = function (player) {
    player.hurt(this)
}

zombieBullet.prototype.collision = function (player) {
    var dis = Math.pow(Math.pow((player.y - this.startY), 2) + Math.pow((player.x - this.startX), 2), 0.5)
    if (dis < this.radius + player.radius) {
        // 圆相交 并且 player在攻击的方向
        if (this.speedX * (player.x - this.startX) > 0) {
            return true
        }
    }
    return false
}

zombieBullet.prototype.getGameWorld = function () {
    return this.owner.owner.gameWorld
}

injector.inject(zombieBullet)

module.exports = zombieBullet