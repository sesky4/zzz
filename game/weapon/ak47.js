var config = require('../../config')
var Bullet = require('../bullet/bullet')
var injector = require('../../eventHandlerInjector')

function ak47(owner) {
    this.owner = owner
    this.bullets = []
    this.lastFire = Date.now()
}

ak47.prototype.canFire = function () {
    var now = Date.now()
    if (now - this.lastFire > 1000 / config.WEAPON.AK47.SHOOT_RATE) {
        return true
    }
    return false
}

ak47.prototype.fire = function (angle) {
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

ak47.prototype.getBullets = function () {
    return this.bullets
}

ak47.prototype.update = function (dt) {
    for (var i in this.bullets) {
        this.bullets[i].update(dt)
    }
}
injector.inject(ak47)

module.exports = ak47