var config = require('../config')
var ak47Food = require('./food/ak47food')
var injector = require('../eventHandlerInjector')

function FoodManager(gameWorld) {
    this.foods = []
    this.gameWorld = gameWorld
}

injector.inject(FoodManager)

FoodManager.prototype.update = function (dt) {
    if (this.foodsCount() < config.FOODS_CONST_NUMBER) {
        var food = this.createRandomNew()
        this.foods.push(food)
        food.on('foodDestroy', (food) => {
            this.foods.splice(this.foods.indexOf(food), 1)
            this.triggerEvent('foodDestroy', food)
        })
        this.triggerEvent('foodBirth', food)
    }
    for (var i in this.foods) {
        this.foods[i].update(dt)
    }
}

FoodManager.prototype.foodsCount = function () {
    return this.foods.length
}

FoodManager.prototype.createNew = function (type) {
    switch (type) {
        case 'ak47':
            var food = new ak47Food(this)
            break;
    }
    return food
}

FoodManager.prototype.createRandomNew = function () {
    var foodList = [
        'ak47'
    ]
    var index = Math.floor(Math.random() * foodList.length)
    var food = this.createNew(foodList[index])
    var posX = (Math.random() - 0.5) * config.MAP.width
    var posY = (Math.random() - 0.5) * config.MAP.height
    food.position(posX, posY)
    return food
}

FoodManager.prototype.getFoods = function () {
    return this.foods
}

module.exports = FoodManager