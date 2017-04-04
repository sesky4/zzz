// var game = new(require('./gameWorld/gameWorld'))()
// var player = require('./gameWorld/player')
// var net2 = require('./net')
// var net = new net2()

// var player = new player('hello')
// game.addPlayer(player)

// global.allCaculationTimes = 0

// var updateRate = 30
// var netRate = 10
// var lastTime = Date.now()
// var lastLogTime = lastTime

// var clientIp = undefined
// var clientPort = undefined

// // temp = console.log
// // console.log = (msg) => {
// //     var between = Date.now() - lastLogTime
// //     if (between > 1000) {
// //         temp(between)
// //         temp(msg)
// //         lastLogTime = Date.now()
// //     }
// // }

// setInterval(
//     () => {
//         var now = Date.now()
//         game.update((now - lastTime) / 1000)
//         lastTime = now
//     },
//     1000 / updateRate
// )

// setInterval(
//     () => {
//         if (!(clientIp || clientPort)) {
//             return
//         }
//         var message = ''
//         message += player.position.x + ','
//         message += player.position.y + ','
//         message += player.speed.x + ','
//         message += player.speed.y + ','
//         net.send(Buffer.from(message), clientPort, clientIp)


//     },
//     1000 / netRate
// )

// net.on('message', (message, remote) => {
//     console.log(remote.address + ':' + remote.port + ' - ' + message);
//     clientIp = remote.address
//     clientPort = remote.port
//     if (message == 'w') {
//         player.speed.y = 3
//         player.speed.x = 0
//     }
//     if (message == 's') {
//         player.speed.y = -3
//         player.speed.x = 0
//     }
//     if (message == 'a') {
//         player.speed.y = 0
//         player.speed.x = -3
//     }
//     if (message == 'd') {
//         player.speed.y = 0
//         player.speed.x = 3
//     }
// })
var config = require('./config')
var net = require('./net')
var gameRoom = require('./gameroom/gameroom')
var masterServer = new net(config.HOST, config.PORT)
var rooms = []

var parseMatchRequest = require('./protocol/matchRequest')
var matchResponse = require('./protocol/matchResponse')

masterServer.on('listening', function () {
    var address = masterServer.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

masterServer.on('message', (message, remote) => {
    console.log(remote.address + ':' + remote.port + ' - ' + message);

    var cIp = remote.address
    var cPort = remote.port
    var request = parseMatchRequest(message.toString())

    if (request && request != config.ERROR.VERSION_MISSMATCH && request != config.ERROR.WRONG_PACKET) {

        for (var i in rooms) {
            var room = rooms[i]

            if (room.canJoin()) {
                room.preAddPlayer(request.userKey)

                var address = room.getAddress()
                var res = matchResponse(address.host, address.port)

                masterServer.send(
                    Buffer.from(res.toString()),
                    cPort,
                    cIp
                )
                return

            }
        }
        // create new room
        var gameroom = new gameRoom(() => {
            rooms.push(gameroom)
            gameroom.preAddPlayer(request.userKey)

            var address = gameroom.getAddress()
            var res = matchResponse(address.host, address.port)


            masterServer.send(
                Buffer.from(res.toString()),
                cPort,
                cIp
            )
        })
        return
    } else {
        // send error
    }
})