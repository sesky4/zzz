var config = require('../../config')
var ak47 = require('../weapon/ak47')
var injector = require('../../eventHandlerInjector')
var baseFood = require('./baseFood')
var uuid = require('uuid/v4')

function AK47FOOD(manager) {
    this.manager = manager
    this.radius = config.FOOD.RADIUS
    this.x = 0
    this.y = 0
    this.type = 'ak47food'
    // for quadtree
    this.w = this.radius
    this.h = this.radius
    this.id = uuid()
}

injector.inject(AK47FOOD)

AK47FOOD.prototype.update = function () {
    this.checkCollision()
}

// getter and setter
AK47FOOD.prototype.position = function (x, y) {
    if (x && y) {
        this.x = x
        this.y = y
        return
    } else {
        return {
            x: this.x,
            y: this.y
        }
    }
}

AK47FOOD.prototype.isCollision = function (player) {
    var dis = Math.pow(Math.pow((player.y - this.y), 2) + Math.pow((player.x - this.x), 2), 0.5)
    if (dis < this.radius + player.radius) {
        return true
    }
    return false
}

AK47FOOD.prototype.checkCollision = function () {
    var tree = this.getGameWorld().tree
    var possiblePlayer = tree.get(this)
    if (possiblePlayer.length == 0) {
        return
    }
    // only trigger once
    for (var i in possiblePlayer) {
        var player = possiblePlayer[i]
        if (player.role == 'jelly' && player.alive) {
            player.equip(ak47)
            this.triggerEvent('foodDestroy', this)
            break
        }
    }

}

AK47FOOD.prototype.getGameWorld = function () {
    return this.manager.gameWorld
}

module.exports = AK47FOOD