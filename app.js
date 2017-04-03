var game = new(require('./gameWorld/gameWorld'))()
var player = require('./gameWorld/player')
var net = require('./net')

var player = new player('hello')
game.addPlayer(player)

global.allCaculationTimes = 0

var updateRate = 30
var netRate = 30
var lastTime = Date.now()
var lastLogTime = lastTime

temp = console.log
console.log = (msg) => {
    var between = Date.now() - lastLogTime
    if (between > 1000) {
        temp(between)
        temp(msg)
        lastLogTime = Date.now()
    }
}

setInterval(
    () => {
        var now = Date.now()
        game.update((now - lastTime) / 1000)
        lastTime = now
    },
    1000 / updateRate
)

setInterval(
    () => {
        var message = ''
        message += player.position.x + ','
        message += player.position.y + ','
        message += player.speed.x + ','
        message += player.speed.y + ','
        net.send(Buffer.from(message), 4000, '127.0.0.1')
    },
    1000 / netRate
)

net.on('message', (message, remote) => {
    console.log(remote.address + ':' + remote.port + ' - ' + message);
    if (message == 'w') {
        player.speed.y = 3
        player.speed.x = 0
    }
    if (message == 's') {
        player.speed.y = -3
        player.speed.x = 0
    }
    if (message == 'a') {
        player.speed.y = 0
        player.speed.x = -3
    }
    if (message == 'd') {
        player.speed.y = 0
        player.speed.x = 3
    }
})