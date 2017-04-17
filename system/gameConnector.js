module.exports = function (game) {
    // var listeners = {}

    this.on = function (event, listener) {
        game.on(event, listener)
    }
}