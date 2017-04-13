var config = require('../../config')
module.exports = function (data) {
    try {
        var obj = JSON.parse(data)
    } catch (error) {
        return {
            // error: error.toString()
            error: "Can't parse packet"
        }
    }

    if (e = parseHeader(obj)) {
        return e
    }

    switch (obj.eventType) {
        case undefined:
            return {
                error: "'eventType' field is required"
            }
        case 'connectRequest':
            return parseConnectRequest(obj)
        case 'moveRequest':
            return parseMoveRequest(obj)
        case 'fireRequest':
            return parseFireRequest(obj)
        case 'exitRequest':
            return parseExitRequest(obj)
        case 'matchRequest':
            return parseMatchRequest(obj)
        default:
            return {
                error: "Server does not support event type " + obj.event
            }
    }
}

function formatPacket(data) {}


function parseHeader(data) {
    // return : null, if succeed
    //          error, if fails
    if (data.magic_number != config.MAGIC_NUMBER) {
        return {
            error: 'wrong packet'
        }
    }
    if (data.version != config.VERSION) {
        return {
            error: 'version mismatch'
        }
    }
    return null
}

function parseConnectRequest(data) {
    try {
        var req = {
            type: 'connectRequest',
            name: data.name
        }
    } catch (error) {
        return {
            error: 'wrong format connectRequest'
        }
    }
    return req
}

function parseMoveRequest(data) {
    try {
        var req = {
            type: 'moveRequest',
            speedX: parseFloat(data.speedX),
            speedY: parseFloat(data.speedY),
        }
    } catch (error) {
        return {
            error: 'wrong format moveRequest'
        }
    }
    return req
}

function parseFireRequest(data) {
    try {
        var req = {
            type: 'fireRequest',
            angle: parseFloat(data.angle)
        }
    } catch (error) {
        return {
            error: 'wrong format fireRequest'
        }
    }
    return req
}

function parseExitRequest(data) {
    return {
        type: 'exitRequest',
    }
}

function parseMatchRequest(data) {
    try {
        var req = {
            type: 'matchRequest',
            userKey: data.userKey
        }
    } catch (error) {
        return {
            error: 'wrong format matchRequest'
        }
    }
    return req
}