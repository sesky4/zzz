module.exports = function (game) {
    var listeners = {}

    this.on = function (event, listener) {
        // if (!listeners[event]) {
        //     listeners[event] = []
        // }
        // listeners[event].push(listener)
        game.on(event, listener)
    }

    // var eventToListen = [
    //     // don't listen to 'playerMove' cause it will
    //     // check playerMove every 1000/checkRate milliseconds
    //     'playerJoin',
    //     'playerBirth',
    //     'playerFire',
    //     'playerDead',
    //     'playerLeft',
    //     'foodBirth',
    //     'foodDestory',
    //     'bulletBirth',
    //     'bulletDestory'
    // ]

    // // 向gameWorld注册监听事件   
    // for (var i in eventToListen) {
    //     var event = eventToListen[i]

    //     game.on(event, (data) => {
    //         // if has event listener registered
    //         if (listeners[event]) {
    //             // call them
    //             for (var eventId in listeners[event]) {
    //                 listeners[event][eventId](data)
    //             }
    //         }
    //     })
    // }
}