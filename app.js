// var config = require('./config')
// var net = require('./net')
// var gameRoom = require('./gameroom/gameroom')

// var masterServer = new net(config.HOST, config.PORT)
// var rooms = []

// var parseMatchRequest = require('./protocol/matchRequest')
// var matchResponse = require('./protocol/matchResponse')

// masterServer.on('listening', function () {
//     var address = masterServer.address();
//     console.log('UDP Server listening on ' + address.address + ":" + address.port);
// });

// masterServer.on('message', (message, remote) => {
//     console.log(remote.address + ':' + remote.port + ' - ' + message);

//     var cIp = remote.address
//     var cPort = remote.port
//     var request = parseMatchRequest(message.toString())

//     if (request && request != config.ERROR.VERSION_MISSMATCH && request != config.ERROR.WRONG_PACKET) {

//         for (var i in rooms) {
//             var room = rooms[i]
//             if (room.canJoin()) {
//                 room.preAddPlayer(request.userKey)

//                 var address = room.getAddress()
//                 var res = matchResponse(address.host, address.port)

//                 masterServer.send(
//                     Buffer.from(res.toString()),
//                     cPort,
//                     cIp
//                 )
//                 return

//             }
//         }
//         // create new room
//         var gameroom = new gameRoom(() => {
//             rooms.push(gameroom)
//             gameroom.preAddPlayer(request.userKey)

//             var address = gameroom.getAddress()
//             var res = matchResponse(address.host, address.port)


//             masterServer.send(
//                 Buffer.from(res.toString()),
//                 cPort,
//                 cIp
//             )
//         })
//         return
//     } else {
//         // send error
//     }
// })
var gameRoom = require('./gameroom/gameroom')
var rooms = []

var gameMatcher = require('./system/gameMatcher')
var matcher = new gameMatcher(4000, (player) => {
    player.socket.write('hello')
    for (var i in rooms) {
        var room = rooms[i]
        if (room.canJoin()) {
            room.preAddPlayer(player.userKey)

            var address = room.getAddress()
            var res = matchResponse(address.host, address.port)

            masterServer.send(
                Buffer.from(res.toString()),
                cPort,
                cIp
            )
        } else {
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
        }
    }
})