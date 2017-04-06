function gameWorld() {
    var startTime = Date.now()
    var map = {
        width: 5000,
        height: 5000
    }
    var players = [];
    var objects = [];

    this.eventListener = {}

    this.update = function (dt) {
        console.log(dt)
        for (var index in this.players) {
            var player = this.players[index]
            player.updatePosition(dt, this.map)
        }
    }

    this.addPlayer = function (player) {
        this.players.push(player)
    }

    this.getPlayerByTag = function (tag) {
        for (var index in this.players) {
            if (this.players[index].tag == tag) {
                return this.players[index]
            }
            return null
        }
    }

    this.getPlayerByTag = function (tag) {
        for (var player in players) {
            if (player.tag == tag) {
                return tag
            }
            return null
        }
    }

    this.on = ((event, listener) => {
        if (!eventListener[event]) {
            eventListener[event] = []
        }
        eventListener[event].push(listener)
    }).bind(this)
}

module.exports = gameWorld