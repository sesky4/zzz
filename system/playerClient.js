var playerConnector = require('./playerConnector')
var gameConnector = require('./gameConnector')
var uuid = require('uuid/v4')
var player = require('../game/player')


function playerClient(user) {
    this.user = user

    this.remoteConnector = new playerConnector(user.socket)

    this.gameConnector = null

    this.gameWorld = null

    this.connectToGameWorld = (function (gameworld) {
        this.gameWorld = gameworld
        this.gameConnector = new gameConnector(gameworld)

        // gameworld message
        this.gameConnector.on('playerJoin', ((data) => {
            console.log('playerJoin')
        }).bind(this))

        this.gameConnector.on('playerBirth', ((data) => {

        }).bind(this))

        this.gameConnector.on('playerFire', ((data) => {

        }).bind(this))

        this.gameConnector.on('playerDead', ((data) => {

        }).bind(this))

        this.gameConnector.on('foodBirth', ((data) => {

        }).bind(this))

        this.gameConnector.on('foodDestory', ((data) => {

        }).bind(this))

        this.gameConnector.on('bulletBirth', ((data) => {

        }).bind(this))

        this.gameConnector.on('bulletDestory', ((data) => {

        }).bind(this))
    }).bind(this)

    // player control message    
    this.remoteConnector.on('playerJoin', ((data) => {
        var id = uuid()
        this.user.id = id
        var p = new player(id)
        this.gameWorld.addPlayer(p)
    }).bind(this))

    this.remoteConnector.on('playerMove', ((data) => {

    }).bind(this))

    this.remoteConnector.on('playerFire', ((data) => {

    }).bind(this))

    this.remoteConnector.on('playerLeft', ((data) => {

    }).bind(this))



}

module.exports = playerClient