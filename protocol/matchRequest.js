var config = require('../config')

function parseMatchRequest(data) {

    var arr = data.split(config.DELIMITER)

    if (arr[0] != config.MAGIC_NUMBER) {
        return config.ERROR.WRONG_PACKET
    }

    if (arr[1] != config.VERSION) {
        return config.ERROR.VERSION_MISSMATCH
    }

    if (arr[2] != config.REQUEST.MATCH_REQUEST_NO) {
        return null
    }

    var request = {
        userKey: arr[3]
    }

    return request
}

module.exports = parseMatchRequest