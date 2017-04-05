var config = {
    HOST: '0.0.0.0',
    PORT: 3000,
    DELIMITER: ',',
    VERSION: '1.0.0',
    MAGIC_NUMBER: 'ZZZ',
    INTERNET_ADDRESS: '127.0.0.1',
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
        MAX_SPEED: 5
    }
}

module.exports = config