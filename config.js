var config = {
    HOST: '0.0.0.0',
    PORT: 3000,
    DELIMITER: ',',
    VERSION: '1.0.0',
    MAGIC_NUMBER: 'ZZZ',
    ERROR: {
        VERSION_MISSMATCH: 1,
        WRONG_PACKET: 2,
    },
    REQUEST: {
        MATCH_REQUEST_NO: 0,
        PLAYER_MOVE: 1,
        PLAYER_FIRE: 2,
    },
    RESPONSE: {
        MATCH_REQUEST_NO: 0,
    },
    GAME_UPDATE_RATE: 60,
    NET_UPDATE_RATE: 60,
    PLAYER: {
        SPEED: {
            MAX: 5
        }
    }
}

module.exports = config
console.log(Math.pow(3, 0.5))