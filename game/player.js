function Player(tag = undefined) {
    this.tag = tag

    this.position = {
        x: 0,
        y: 0
    }

    this.speed = {
        x: 0,
        y: 0
    }

    this.accelerate = {
        x: 0,
        y: 0
    }

    this.updatePosition = function (dt, limitRange) {

        // vt + 1/2 * a*t*t
        this.position.x += this.speed.x * dt + this.accelerate.x * dt * dt / 2
        this.position.y += this.speed.y * dt + this.accelerate.y * dt * dt / 2

        xMin = -limitRange.width / 2
        xMax = limitRange.width / 2
        yMin = -limitRange.height / 2
        yMax = limitRange.height / 2

        this.position.x = this.position.x > xMax ? xMax : this.position.x
        this.position.x = this.position.x < xMin ? xMin : this.position.x
        this.position.y = this.position.y > yMax ? xMax : this.position.y
        this.position.y = this.position.y < yMin ? xMax : this.position.y

        this.speed.x += this.accelerate.x * dt
        this.speed.y += this.accelerate.y * dt

        console.log(this.speed)
    }
}

module.exports = Player