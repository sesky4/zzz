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

    // did not use it
    // this.accelerate = {
    //     x: 0,
    //     y: 0
    // }

    var bullets = []

    this.eventListener = {}

    var lastShoot = Date.now()

    this.updatePosition = function (dt, limitRange) {

        // joke
        // this.speed.x = Math.random() * 10 - 5
        // this.speed.y = Math.random() * 10 - 5


        // vt + 1/2 * a*t*t
        this.x += this.speed.x * dt /*+ this.accelerate.x * dt * dt / 2*/
        this.y += this.speed.y * dt /*+ this.accelerate.y * dt * dt / 2*/

        xMin = -limitRange.width / 2
        xMax = limitRange.width / 2
        yMin = -limitRange.height / 2
        yMax = limitRange.height / 2

        this.x = this.x > xMax ? xMax : this.x
        this.x = this.x < xMin ? xMin : this.x
        this.y = this.y > yMax ? xMax : this.y
        this.y = this.y < yMin ? xMax : this.y

        // this.speed.x += this.accelerate.x * dt
        // this.speed.y += this.accelerate.y * dt
        // console.log('' + this.x + ' ' + this.y)
    }

    this.updateBullets = function (dt, limitRange) {
        for (var i in bullets) {
            var bullet = bullets[i]
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

    this.getBullets = function () {
        return bullets
    }

    this.removeBullet = function (bulletId) {
        for (var i in bullets) {
            if (bullets[i].id == bulletId) {
                this.triggerEvent('bulletDestory', bullets[i])
                bullets.splice(i, 1)
            }
        }
    }

    this.fire = (function (bulletInfo) {
        if (canFire()) {
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
            bullets.push(bullet)

            this.triggerEvent('bulletBirth', bullet)
        }
    }).bind(this)

    function canFire() {
        var now = Date.now()
        if (now - lastShoot > 1000 / config.PLAYER.MAX_SHOOT_RATE) {
            lastShoot = now
            return true
        }
        return false
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
}

module.exports = Player