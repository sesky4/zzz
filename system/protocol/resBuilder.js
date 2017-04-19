var config = require('../../config')

module.exports = function (resType, data) {
    // data: {}
    // return: Buffer
    var res
    switch (resType) {
        case 'error':
            res = buildError(data)
            break
        case 'playerJoin':
            res = buildPlayerJoin(data)
            break
        case 'matchGame':
            res = buildMatchGame()
            break
        case 'connectGame':
            res = buildConnectGame(data)
            break
        case 'playerDead':
            res = buildPlayerDead(data)
            break
        case 'playerFire':
            res = buildPlayerFire(data)
            break
        case 'syncPlayer':
            res = buildSyncPlayer(data)
            break
        case 'syncBullet':
            res = buildSyncBullet(data)
            break
        case 'bulletBirth':
            res = buildBulletBirth(data)
            break
        case 'bulletDestory':
            res = buildBulletDestory(data)
            break
    }
    var signP = addSign(res)
    var prefixP = addPrefix(signP)
    return prefixP
}


function addPrefix(msg) {
    var length = msg.length
    // console.log(length)

    var buf1 = new Buffer(2)
    buf1.writeUInt16LE(length)

    var buf2 = Buffer.from(msg)
    return Buffer.concat([buf1, buf2])
}

// maybe I should add use 'packetLength + packet' format to ensure byte stream don't mess up
function addSign(msg) {
    var packet = {
        eventType: JSON.parse(msg).eventType,
        data: msg
    }
    return JSON.stringify(packet)
}

function addHeader(packet) {
    packet.magic_number = 'ZZZ'
    packet.version = config.VERSION
    return packet
}

function buildError(data) {
    return JSON.stringify(addHeader(data))
}

function buildPlayerJoin(data) {
    // data=players:[]
    var players = []
    for (var i in data) {
        var player = {
            id: data[i].id,
            name: data[i].name
        }
        players.push(player)
    }
    var packet = {
        players: players,
        eventType: 'playerJoin'
    }
    return JSON.stringify(addHeader(packet))
}

function buildMatchGame() {
    var packet = {
        result: 'OK',
        eventType: 'matchGame'
    }
    return JSON.stringify(addHeader(packet))
}

function buildConnectGame(data) {
    var packet = {
        result: 'OK',
        eventType: 'connectGame',
        id: data
    }
    return JSON.stringify(addHeader(packet))
}

function buildPlayerDead(data) {
    var packet = {
        id: data.id,
        eventType: 'playerDead'
    }
    return JSON.stringify(addHeader(packet))
}

function buildSyncPlayer(data) {
    var packet = {
        eventType: 'syncPlayer',
        players: []
    }
    for (var i in data.players) {
        // console.log("" + data.players[i].speed.x + '       ' + data.players[i].speed.y)
        packet.players.push({
            id: data.players[i].id,
            name: data.players[i].name,
            x: data.players[i].x,
            y: data.players[i].y,
            speedX: data.players[i].speed.x,
            speedY: data.players[i].speed.y,
        })
    }
    return JSON.stringify(addHeader(packet))
}

function buildSyncBullet(data) {
    var packet = {
        eventType: 'syncBullet',
        bullets: []
    }
    for (var i in data.bullets) {
        packet.bullets.push({
            id: data.bullets[i].id,
            x: data.bullets[i].x,
            y: data.bullets[i].y,
            speedX: data.bullets[i].speedX,
            speedY: data.bullets[i].speedY
        })
    }
    return JSON.stringify(addHeader(packet))
}

function buildBulletDestory(data) {
    var packet = {
        eventType: 'bulletDestory',
        id: data.id

    }
    return JSON.stringify(addHeader(packet))
}

function buildBulletBirth(data) {
    var packet = {
        eventType: 'bulletBirth',
        bullet: {
            id: data.id,
            startX: data.x,
            startY: data.y,
            speedX: data.speedX,
            speedY: data.speedY,
            maxDistance: data.maxDistance
        }
    }
    return JSON.stringify(addHeader(packet))
}

function buildPlayerFire(data) {
    var packet = {
        eventType: 'playerStateChange',
        bullet: {
            id: data.id
        }
    }
    return JSON.stringify(addHeader(packet))
}