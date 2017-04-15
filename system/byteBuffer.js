module.exports = function () {
    var buffer = new Buffer(0)

    this.append = function (bytes) {
        buffer = Buffer.concat([buffer, bytes])
    }

    this.read = function (count) {
        if (count > buffer.length) {
            return null
        }
        return buffer.slice(0, count)
    }

    this.removeHead = function (count) {
        buffer = buffer.slice(count, buffer.length)
    }

    this.readAndRemove = function (count) {
        var re = this.read(count)
        this.removeHead(count)
        return re
    }
}