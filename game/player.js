var config = require('../config')

function Player(id, name) {
    this.id = id
    this.name = name
    this.x = 0
    this.y = 0
    this.w = config.PLAYER.W
    this.h = config.PLAYER.H
    this.radius = config.PLAYER.RADIUS
    this.speed = {
        x: 0,
        y: 0
    }
    this.bullets = []
    this.eventListener = {}
    this.lastShoot = Date.now()
    this.alive = true
}

Player.prototype.on = function (event, listener) {
    if (!this.eventListener[event]) {
        this.eventListener[event] = []
    }
    this.eventListener[event].push(listener)
}

Player.prototype.triggerEvent = function (event, data) {
    if (this.eventListener[event]) {
        // call them
        for (var eventId in this.eventListener[event]) {
            this.eventListener[event][eventId](data)
        }
    }
}

Player.prototype.canFire = function () {
    var now = Date.now()
    if (now - this.lastShoot > 1000 / config.PLAYER.MAX_SHOOT_RATE) {
        this.lastShoot = now
        return true
    }
    return false
}

Player.prototype.fire = function (bulletInfo) {
    if (this.canFire()) {
        var bullet = {
            id: bulletInfo.id,
            owner: this,
            ownerId: this.id,
            startX: this.x,
            startY: this.y,
            maxDistance: config.PLAYER.BULLET.MAX_DISTANCE,
            speedX: bulletInfo.x,
            speedY: bulletInfo.y,
            x: this.x,
            y: this.y,
            // weight and height is necessary for quadtree
            w: config.PLAYER.BULLET.W,
            h: config.PLAYER.BULLET.H,
            removeSelf: function () {
                this.owner.removeBullet(this.id)
            }
        }
        this.bullets.push(bullet)

        this.triggerEvent('bulletBirth', bullet)
    }
}

Player.prototype.getBullets = function () {
    return this.bullets
}

Player.prototype.removeBullet = function (bulletId) {
    for (var i in this.bullets) {
        if (this.bullets[i].id == bulletId) {
            this.triggerEvent('bulletDestory', this.bullets[i])
            this.bullets.splice(i, 1)
        }
    }
}

Player.prototype.updateBullets = function (dt, limitRange) {
    for (var i in this.bullets) {
        var bullet = this.bullets[i]
        bullet.x += bullet.speedX * dt
        bullet.y += bullet.speedY * dt

        xMin = -limitRange.width / 2
        xMax = limitRange.width / 2
        yMin = -limitRange.height / 2
        yMax = limitRange.height / 2

        bullet.x = bullet.x > xMax ? xMax : bullet.x
        bullet.x = bullet.x < xMin ? xMin : bullet.x
        bullet.y = bullet.y > yMax ? xMax : bullet.y
        bullet.y = bullet.y < yMin ? xMax : bullet.y
        // console.log(bullet)
        if (Math.pow(Math.pow(bullet.x - bullet.startX, 2) + Math.pow(bullet.y - bullet.startY, 2), 0.5) > bullet.maxDistance) {
            bullet.removeSelf()
        }
    }
}

Player.prototype.updatePosition = function (dt, limitRange) {
    // vt + 1/2 * a*t*t
    this.x += this.speed.x * dt
    this.y += this.speed.y * dt

    xMin = -limitRange.width / 2
    xMax = limitRange.width / 2
    yMin = -limitRange.height / 2
    yMax = limitRange.height / 2

    this.x = this.x > xMax ? xMax : this.x
    this.x = this.x < xMin ? xMin : this.x
    this.y = this.y > yMax ? xMax : this.y
    this.y = this.y < yMin ? xMax : this.y
}

Player.prototype.hurt = function (bullet) {
    this.alive = false
    this.triggerEvent('playerDead', this)
}
module.exports = Player