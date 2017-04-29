var oa = 1
this.ob = 2
var o = function () {
    this.a = 1;
    this.b = 2;
    setInterval(this.alert, 1000)
}

o.prototype.alert = function () {
    console.log(this)
}

var test = new o()