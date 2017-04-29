var config = require('../config')
var Bullet = require('../game/bullet/bullet')
var Gun = require('./weapon/gun')
var ZombiePaw = require('./weapon/zombiePaw')
var injector = require('../eventHandlerInjector')

function Player(id, name) {
    this.id = id
    this.name = name
    this.x = (Math.random() - 0.5) * config.MAP.width
    this.y = (Math.random() - 0.5) * config.MAP.height
    this.w = config.PLAYER.W
    this.h = config.PLAYER.H
    this.radius = config.PLAYER.RADIUS
    this.speedX = 0
    this.speedY = 0
    this.bullets = []
    this.lastShoot = Date.now()
    this.alive = true
    this.score = 0
    this.weapon = null
    this.immutable = false

    this.giveImmutable(config.PLAYER.JELLY.DEFAULT_IMU_TIME)

    this.equip(Gun)
    this.role = 'jelly'
    this.maxSpeed = config.PLAYER.JELLY.MAX_SPEED
    this.hp = config.PLAYER.JELLY.DEFAULT_HP
    this.maxHp = config.PLAYER.JELLY.DEFAULT_HP
}

injector.inject(Player)

Player.prototype.fire = function (angle) {
    this.weapon.fire(angle)
}

Player.prototype.equip = function (weapon) {
    //weapon is the constructor
    if (weapon) {
        this.weapon = new weapon(this)
        this.weapon.on('bulletBirth', (data) => {
            this.triggerEvent('bulletBirth', data)
        })
        this.weapon.on('bulletDestroy', (data) => {
            this.triggerEvent('bulletDestroy', data)
        })
    }
}

Player.prototype.getBullets = function () {
    return this.weapon.getBullets()
}

Player.prototype.update = function (dt) {
    this.updatePosition(dt)
    this.weapon.update(dt)
}

Player.prototype.updatePosition = function (dt) {
    if (!this.alive) {
        return
    }
    var limitRange = config.MAP
    this.x += this.speedX * dt
    this.y += this.speedY * dt

    xMin = -limitRange.width / 2
    xMax = limitRange.width / 2
    yMin = -limitRange.height / 2
    yMax = limitRange.height / 2

    this.x = Math.min(this.x, xMax)
    this.x = Math.max(this.x, xMin)
    this.y = Math.min(this.y, yMax)
    this.y = Math.max(this.y, yMin)
}

//todo: change here add hp related infomation
Player.prototype.hurt = function (bullet) {
    switch (bullet.type) {
        case 'bullet':
            bullet.owner.owner.score += bullet.damage
            this.injure(bullet.damage)
            break;
        case 'zombieBullet':
            bullet.owner.owner.score += bullet.damage
            if (this.role == 'jelly') {
                this.affected()
                break;
            }
            if (this.role == 'zombie') {
                this.injure(bullet.damage)
                break;
            }
            break;
    }

}

Player.prototype.affected = function () {
    this.equip(ZombiePaw)
    this.role = 'zombie'
    this.hp = config.PLAYER.ZOMBIE.DEFAULT_HP
    this.maxHp = config.PLAYER.ZOMBIE.DEFAULT_HP
    this.maxSpeed = config.PLAYER.ZOMBIE.MAX_SPEED
    this.triggerEvent('playerAffected', this)
}

Player.prototype.injure = function (damage) {
    this.hp -= damage
    if (this.hp <= 0) {
        this.alive = false
        this.triggerEvent('playerDead', this)
    }
}

Player.prototype.speed = function (spX, spY) {
    if (spX != undefined && spY != undefined && this.alive) {
        this.speedX = spX * this.maxSpeed
        this.speedY = spY * this.maxSpeed
        return
    } else {
        return {
            speedX: this.speedX,
            speedY: this.speedY
        }
    }
}

Player.prototype.reborn = function () {
    this.alive = true
    this.x = (Math.random() - 0.5) * config.MAP.width
    this.y = (Math.random() - 0.5) * config.MAP.height

    this.equip(Gun)
    this.role = 'jelly'
    this.maxSpeed = config.PLAYER.JELLY.MAX_SPEED
    this.hp = config.PLAYER.JELLY.DEFAULT_HP
    this.maxHp = config.PLAYER.JELLY.DEFAULT_HP

    this.giveImmutable(config.PLAYER.JELLY.DEFAULT_IMU_TIME)
}

Player.prototype.giveImmutable = function (delay) {
    this.immutable = true
    setTimeout(() => {
        this.immutable = false
    }, delay * 1000)
}
module.exports = Player