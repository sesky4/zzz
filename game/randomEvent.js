var config = require('../config')

function randomEvent(gameWorld) {
    this.game = gameWorld
}

randomEvent.prototype.update = function () {
    var players = this.game.getAllPlayers()
    var normals = []

    var all = 0
    var zombies = 0
    for (var i in players) {
        all++
        if (players[i].role == 'zombie') {
            zombies++
        } else {
            normals.push(players[i])
        }
    }
    if (config.ZOMBIE_JELLY[all] > zombies) {
        var index = Math.floor(Math.random() * normals.length)
        normals[index].affected()
    }
}

module.exports = randomEvent