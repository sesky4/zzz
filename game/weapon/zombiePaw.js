var config = require('../../config')
var injector = require('../../eventHandlerInjector')
var Bullet = require('../bullet/zombieBullet')

function zombiePaw(owner) {
    this.owner = owner
    this.bullets = []
    this.lastFire = Date.now()
}

zombiePaw.prototype.canFire = function () {
    var now = Date.now()
    if (now - this.lastFire > 1000 / config.WEAPON.ZOMBIE_PAW.SHOOT_RATE) {
        return true
    }
    return false
}

zombiePaw.prototype.fire = function (angle) {
    if (this.canFire()) {
        var bullet = new Bullet(this, angle)
        bullet.on('bulletDestroy', (data) => {
            for (var i in this.bullets) {
                if (this.bullets[i].id == data.id) {
                    this.triggerEvent('bulletDestroy', this.bullets[i])
                    this.bullets.splice(i, 1)
                }
            }
        })
        this.bullets.push(bullet)
        this.lastFire = Date.now()
        this.triggerEvent('bulletBirth', bullet)
    }
}

zombiePaw.prototype.getBullets = function () {
    return []
}

zombiePaw.prototype.update = function (dt) {
    for (var i in this.bullets) {
        this.bullets[i].update(dt)
    }
}
injector.inject(zombiePaw)

module.exports = zombiePaw