var config = {
    HOST: '0.0.0.0',
    PORT: 44444,

    DELIMITER: ',',
    VERSION: '1.0.0',
    MAGIC_NUMBER: 'ZZZ',
    INTERNET_ADDRESS: '127.0.0.1',

    GAME_UPDATE_RATE: 60,
    NET_UPDATE_RATE: 30,

    MAP: {
        width: 5000,
        height: 5000
    },
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


    PLAYER: {
        MAX_SPEED: 3,
        RADIUS: 0.7,
        W: 1,
        H: 1,
        MAX_SHOOT_RATE: 3,
        BULLET: {
            MAX_SPEED: 10,
            MAX_DISTANCE: 20,
            W: 1,
            H: 1
        }
    },
    GAMEROOM: {
        MAX_PLAYER: 20

    }
}

module.exports = config