var playerConnector = require('./playerConnector')
var gameConnector = require('./gameConnector')
var uuid = require('uuid/v4')
var player = require('../game/player')
var resBuilder = require('./protocol/resBuilder')
var config = require('../config')


function playerClient(user) {
    this.user = user
    this.remoteConnector = new playerConnector(user.socket)
    this.gameConnector = null
    this.gameWorld = null
    this.alreadyAdd = false

    this.setUp()
}

playerClient.prototype.connectToGameWorld = function (gameworld) {
    this.gameWorld = gameworld
    this.gameConnector = new gameConnector(gameworld)
}

playerClient.prototype.setUp = function () {
    // player control message    
    this.remoteConnector.on('connectRequest', (data) => {
        // gameworld message
        this.gameConnector.on('playerJoin', (data) => {
            this.user.socket.write(resBuilder('connectGame', this.user.id))
        })

        this.gameConnector.on('playerBirth', (data) => {
            var res = resBuilder('playerBirth', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('playerFire', (data) => {
            var res = resBuilder('playerFire', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('playerDead', (data) => {
            var res = resBuilder('playerDead', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('playerReborn', (data) => {
            var res = resBuilder('playerReborn', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('playerAffected', (player) => {
            var res = resBuilder('playerAffected', player)
            this.user.socket.write(res)
        })

        this.gameConnector.on('playerLeft', (data) => {
            var res = resBuilder('playerLeft', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('foodBirth', (data) => {
            var res = resBuilder('foodBirth', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('foodDestroy', (data) => {
            var res = resBuilder('foodDestroy', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('bulletBirth', (data) => {
            var res = resBuilder('bulletBirth', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('bulletDestroy', (data) => {
            var res = resBuilder('bulletDestroy', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('syncPlayer', (data) => {
            var res = resBuilder('syncPlayer', data)
            this.user.socket.write(res)
        })

        // this.gameConnector.on('syncBullet', (data) => {
        //     var res = resBuilder('syncBullet', data)
        //     this.user.socket.write(res)
        // })

        this.gameConnector.on('leaderBoardUpdate', (data) => {
            var res = resBuilder('leaderBoardUpdate', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('gameOver', (data) => {
            var res = resBuilder('gameOver', data)
            this.user.socket.end(res)
        })


        // add listener first so that it can reveive myself's join-event        
        if (this.alreadyAdd) {
            return
        }
        this.alreadyAdd = true
        var id = uuid()
        var p = new player(id, data.name)
        this.user.id = id
        this.user.player = p
        this.gameWorld.addPlayer(p)
    })

    this.remoteConnector.on('moveRequest', (data) => {
        this.gameWorld.setPlayerSpeed(this.user.id, {
            x: data.speedX,
            y: data.speedY
        })
    })

    this.remoteConnector.on('fireRequest', (data) => {
        this.gameWorld.makeFire(this.user.id, data.angle)
    })

    this.remoteConnector.on('exitRequest', (data) => {
        this.gameWorld.removePlayer(this.user.id)
    })

    this.remoteConnector.on('rebornRequest', (data) => {
        this.gameWorld.rebornPlayer(this.user.id)
    })
}

playerClient.prototype.close = function () {
    // this.user.socket.destroy()
    // this.user.socket.end()
}

module.exports = playerClient