module.exports = function (game) {
    this.fbListener = null
    this.fdListener = null
    this.on = function (event, listener) {
        if (event == 'foodDestroy') {
            this.fdListener = listener
        }
        if (event == 'foodBirth') {
            this.fbListener = listener
        }
        if (event == 'playerJoin') {
            var temp = listener
            listener = () => {
                temp()
                game.getFoods().map((f) => {
                    this.fbListener(f)
                })
            }
        }
        game.on(event, listener)
    }
}