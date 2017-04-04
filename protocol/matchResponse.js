var config = require('../config')

function matchResponse(host, port) {
    this.host = host
    this.port = port
    return {
        toString: function () {
            return `${config.MAGIC_NUMBER}${config.DELIMITER}` +
                `${config.VERSION}${config.DELIMITER}` +
                `${config.RESPONSE.MATCH_REQUEST_NO}${config.DELIMITER}` +
                `${host}${config.DELIMITER}` +
                `${port}${config.DELIMITER}`
        }
    }
}

module.exports = matchResponse