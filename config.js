var config = {
    HOST: '0.0.0.0',
    PORT: 44444,

    DELIMITER: ',',
    VERSION: '1.0.0',
    MAGIC_NUMBER: 'ZZZ',
    INTERNET_ADDRESS: '127.0.0.1',
    EVERY_GAME_TIME: 5, //in seconds

    GAME_UPDATE_RATE: 60, // unit is Hz
    NET_UPDATE_RATE: 30,
    LEADERBOARD_UPDATE_RATE: 1,

    MAP: {
        width: 100,
        height: 100
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
        RADIUS: 0.7,
        W: 1,
        H: 1,
        JELLY: {
            MAX_SPEED: 3,
            DEFAULT_HP: 100,
            DEFAULT_IMU_TIME: 5,
        },
        ZOMBIE: {
            MAX_SPEED: 5,
            DEFAULT_HP: 1000,
        },
    },

    BULLET: {
        NORMAL: {
            MAX_SPEED: 10,
            MAX_DISTANCE: 20,
            W: 1,
            H: 1
        },
        ZOMBIE_BULLET: {
            MAX_SPEED: 10,
            MAX_DISTANCE: 20,
            W: 1,
            H: 1
        },
    },

    WEAPON: {
        AK47: {
            SHOOT_RATE: 6,
        },
        GUN: {
            SHOOT_RATE: 3,
        },
        ZOMBIE_PAW: {
            SHOOT_RATE: 3,
        }
    },

    FOOD: {
        RADIUS: 1,
    },

    GAMEROOM: {
        MAX_PLAYER: 20
    },

    FOODS_CONST_NUMBER: 10,

    ZOMBIE_JELLY: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9]
}

module.exports = config