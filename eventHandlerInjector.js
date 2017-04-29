function eventHandlerInjector() {

}

eventHandlerInjector.prototype.inject = function (cls) {
    cls.prototype.on = function (event, listener) {
        if (!this.eventListener) {
            this.eventListener = {}
        }
        if (!this.eventListener[event]) {
            this.eventListener[event] = []
        }
        this.eventListener[event].push(listener)
    }

    cls.prototype.triggerEvent = function (event, data) {
        if (!this.eventListener) {
            this.eventListener = {}
        }
        if (this.eventListener[event]) {
            // call them
            for (var eventId in this.eventListener[event]) {
                this.eventListener[event][eventId](data)
            }
        }
    }
}

module.exports = new eventHandlerInjector()