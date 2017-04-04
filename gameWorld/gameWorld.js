function gameWorld() {
    this.startTime = Date.now();
    this.map = {
        width: 5000,
        height: 5000
    }
    this.players = [];
    this.objects = [];

    this.update = function (dt) {
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
}

module.exports = gameWorld