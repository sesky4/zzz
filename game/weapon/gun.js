var config = require('../../config')
var Bullet = require('../bullet/bullet')
var injector = require('../../eventHandlerInjector')

function gun(owner) {
    this.owner = owner
    this.bullets = []
    this.lastFire = Date.now()
}

gun.prototype.canFire = function () {
    var now = Date.now()
    if (now - this.lastFire > 1000 / config.WEAPON.GUN.SHOOT_RATE) {
        return true
    }
    return false
}

gun.prototype.fire = function (angle) {
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

gun.prototype.getBullets = function () {
    return this.bullets
}

gun.prototype.update = function (dt) {
    for (var i in this.bullets) {
        this.bullets[i].update(dt)
    }
}
injector.inject(gun)

module.exports = gun