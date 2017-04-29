var config = require('../../config')
var injector = require('../../eventHandlerInjector')
var uuid = require('uuid/v4')

function bullet(owner, angle) {
    var rad = angle * Math.PI / 180
    var dirX = config.BULLET.NORMAL.MAX_SPEED * Math.cos(rad)
    var dirY = config.BULLET.NORMAL.MAX_SPEED * Math.sin(rad)

    this.type = 'bullet'
    this.id = uuid()
    this.owner = owner
    this.playerId = owner.owner.id
    this.startX = owner.owner.x
    this.startY = owner.owner.y
    this.maxDistance = config.BULLET.NORMAL.MAX_DISTANCE
    this.speedX = dirX
    this.speedY = dirY
    this.x = owner.owner.x
    this.y = owner.owner.y
    this.radius = 0
    this.pushDistance = 1
    // weight and height is necessary for quadtree
    this.w = config.BULLET.NORMAL.W
    this.h = config.BULLET.NORMAL.H

    this.damage = 100
}

bullet.prototype.destroy = function () {
    this.triggerEvent('bulletDestroy', this)
}

bullet.prototype.update = function (dt) {
    if (!this.updatePosition(dt)) {
        this.destroy()
        return
    }
    this.checkCollision()

}

//return false if it should be destroy
bullet.prototype.updatePosition = function (dt) {
    var limitRange = config.MAP

    this.x += this.speedX * dt
    this.y += this.speedY * dt

    var xMin = -limitRange.width / 2
    var xMax = limitRange.width / 2
    var yMin = -limitRange.height / 2
    var yMax = limitRange.height / 2

    // bullet can exceed the limitation otherwise distance calculation will work wrong when at edge    
    // this.x = Math.min(this.x, xMax)
    // this.x = Math.max(this.x, xMin)
    // this.y = Math.min(this.y, yMax)
    // this.y = Math.max(this.y, yMin)
    if (Math.pow(Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2), 0.5) > this.maxDistance) {
        return false
    }
    return true
}

bullet.prototype.checkCollision = function () {
    var tree = this.getGameWorld().tree
    var possiblePlayer = tree.get(this)
    if (possiblePlayer.length == 0) {
        return
    }
    for (var i in possiblePlayer) {
        var player = possiblePlayer[i]
        // 不是自己 并且敌方是 僵尸
        if (this.playerId != player.id && player.role == 'zombie' && !player.immutable) {
            if (this.isCollision(player)) {
                this.effect(player)
                this.destroy()
            }
        }
    }
}

bullet.prototype.getGameWorld = function () {
    return this.owner.owner.gameWorld
}

bullet.prototype.effect = function (player) {
    var mod = this.normalize(this.speedX, this.speedY)
    player.x += this.speedX / mod * this.pushDistance
    player.y += this.speedY / mod * this.pushDistance
    player.hurt(this)
}

bullet.prototype.isCollision = function (player) {
    var dis = Math.pow(Math.pow((player.y - this.y), 2) + Math.pow((player.x - this.x), 2), 0.5)
    if (dis < this.radius + player.radius) {
        return true
    }
    return false
}

bullet.prototype.normalize = function (x, y) {
    return Math.pow(x * x + y * y, 0.5)
}

injector.inject(bullet)

module.exports = bullet