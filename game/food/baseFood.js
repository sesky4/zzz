var uuid = require('uuid/v4')

module.exports = function baseFood() {
    this.id = uuid()
}