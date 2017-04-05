var config = require('../../config')

function matchResponse(host, port) {
    this.host = host
    this.port = port
    return {
        host: host,
        port: port,
        toString: function () {
            var str = {
                zzz: config.MAGIC_NUMBER,
                version: config.VERSION,
                type: config.RESPONSE.MATCH_REQUEST_NO,
                host: host,
                port: port
            }
            return JSON.stringify(str)
            // return `${config.MAGIC_NUMBER}${config.DELIMITER}` +
            //     `${config.VERSION}${config.DELIMITER}` +
            //     `${config.RESPONSE.MATCH_REQUEST_NO}${config.DELIMITER}` +
            //     `${host}${config.DELIMITER}` +
            //     `${port}${config.DELIMITER}`
        }
    }
}

module.exports = matchResponse