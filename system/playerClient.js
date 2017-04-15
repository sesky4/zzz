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

    this.connectToGameWorld = (function (gameworld) {
        this.gameWorld = gameworld
        this.gameConnector = new gameConnector(gameworld)
    }).bind(this)

    this.alreadyAdd = false

    // player control message    
    this.remoteConnector.on('connectRequest', ((data) => {
        // gameworld message
        this.gameConnector.on('playerJoin', ((data) => {
            console.log('playerJoin')
            this.user.socket.write(resBuilder('connectGame', this.user.id))

            // sync all players
            // var res = resBuilder('playerJoin', data)
            // this.user.socket.write(res)
        }).bind(this))

        this.gameConnector.on('playerBirth', ((data) => {
            var res = resBuilder('playerBirth', data)
            this.user.socket.write(res)
        }).bind(this))

        this.gameConnector.on('playerFire', ((data) => {
            var res = resBuilder('playerFire', data)
            this.user.socket.write(res)
        }).bind(this))

        this.gameConnector.on('playerDead', ((data) => {
            var res = resBuilder('playerDead', data)
            this.user.socket.write(res)
        }).bind(this))

        this.gameConnector.on('playerLeft', ((data) => {
            var res = resBuilder('playerLeft', data)
            this.user.socket.write(res)
        }).bind(this))

        this.gameConnector.on('foodBirth', ((data) => {
            var res = resBuilder('foodBirth', data)
            this.user.socket.write(res)
        }).bind(this))

        this.gameConnector.on('foodDestory', ((data) => {
            var res = resBuilder('foodDestory', data)
            this.user.socket.write(res)
        }).bind(this))

        this.gameConnector.on('bulletBirth', ((data) => {
            var res = resBuilder('bulletBirth', data)
            this.user.socket.write(res)
        }).bind(this))

        this.gameConnector.on('bulletDestory', ((data) => {
            var res = resBuilder('bulletDestory', data)
            this.user.socket.write(res)
        }).bind(this))

        this.gameConnector.on('syncPlayer', (data) => {
            var res = resBuilder('syncPlayer', data)
            this.user.socket.write(res)
        })

        this.gameConnector.on('syncBullet', (data) => {
            var res = resBuilder('syncBullet', data)
            this.user.socket.write(res)
        })

        // add listener first in order to listen to my join-event        
        if (this.alreadyAdd) {
            return
        }
        this.alreadyAdd = true
        var id = uuid()
        var p = new player(id, this.user.userKey)
        this.user.id = id
        this.user.player = p
        this.gameWorld.addPlayer(p)
    }).bind(this))

    this.remoteConnector.on('moveRequest', ((data) => {
        this.gameWorld.setPlayerSpeed(this.user.id, {
            x: data.speedX,
            y: data.speedY
        })
    }).bind(this))

    this.remoteConnector.on('fireRequest', ((data) => {
        this.gameWorld.makeFire(this.user.id, data.angle, uuid())
    }).bind(this))

    this.remoteConnector.on('exitRequest', ((data) => {
        this.gameWorld.removePlayer(this.user.id)
    }).bind(this))



}

module.exports = playerClient