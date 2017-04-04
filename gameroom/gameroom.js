var gameworld = require('../gameWorld/gameWorld')
var Player = require('../gameWorld/player')
var net = require('../net')
var config = require('../config')

function gameroom(callback) {
    this.MAX_PLAYER = 2
    this.clients = []
    this.gameWorld = new gameworld()
    this.net = new net('0.0.0.0', 0)
    this.updateRate = 60
    this.clientUpdateRate = 10
    this.gameUpdateRate = config.GAME_UPDATE_RATE
    this.netUpdateRate = config.NET_UPDATE_RATE

    var lastGameTick = Date.now()

    setInterval(() => {
        var dt = Date.now() - lastGameTick
        this.gameWorld.update(dt)
        lastGameTick = Date.now()
    }, 1000 / this.gameUpdateRate)


    this.net.on('listening', function () {
        callback()
    });

    function handleMove(msg) {
        var player = this.getClientByKey(msg[3]).player
        var speedX = parseFloat(msg[4])
        var speedY = parseFloat(msg[5])
        var squareSum = speedX * speedX + speedY * speedY
        var mod = Math.pow(squareSum, 0.5)
        player.speed.x = speedX / mod * config.PLAYER.SPEED.MAX
        player.speed.y = speedY / mod * config.PLAYER.SPEED.MAX
    }

    function handleMessage(message, remote) {
        var msg = message.toString().split(config.DELIMITER)
        var key = msg[3]
        var client = this.getClientByKey(key)
        if (!client) {
            return
        }
        client.host = remote.address
        client.port = remote.port

        switch (parseInt(msg[2])) {
            case config.REQUEST.PLAYER_MOVE:
                handleMove.bind(this)(msg)
                break;
            case config.REQUEST.PLAYER_FIRE:
                handleFire.bind(this)(msg)
                break;
        }
        this.net.send(Buffer.from('qwe'), remote.port, remote.addresss)
    }

    this.net.on('message', handleMessage.bind(this));

    this.preAddPlayer = function (userKey) {
        var player = new Player(userKey)
        var client = {
            userKey: userKey,
            player: player
        }
        this.clients.push(client)


        this.gameWorld.addPlayer(player)
    }

    this.canJoin = function () {
        return this.clients.length < this.MAX_PLAYER
    }

    this.getClientByKey = function (userKey) {
        for (var i in this.clients) {
            var client = this.clients[i]
            if (client.userKey == userKey) {
                return client
            }
        }
        return null
    }

    this.getAddress = function () {
        var address = {
            host: '127.0.0.1',
            port: this.net.address().port
        }
        return address
    }



}

module.exports = gameroom