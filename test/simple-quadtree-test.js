var quadtree = require('simple-quadtree')
var h = 1000
var w = 1000
var tree = quadtree(0, 0, h, w)

var a = []
var b = []
var lastTime = Date.now()
for (var i = 0; i < 1000000; i++) {
    a.push({
        x: w * Math.random(),
        y: h * Math.random(),
        h: 1,
        w: 1
    })
}
var now = Date.now()
console.log('init a takes :' + (now - lastTime) + ' ms')
lastTime = now

for (var i = 0; i < 1000; i++) {
    b.push({
        x: w * Math.random(),
        y: h * Math.random(),
        h: 1,
        w: 1
    })
}
now = Date.now()
console.log('init b takes :' + (now - lastTime) + ' ms')
lastTime = now

var aIns = b
var aFind = b

aIns.map(tree.put)
now = Date.now()
console.log('insertion :' + (now - lastTime) + ' ms')
lastTime = now

var sum = 0
for (var itemIndex in aFind) {
    ! function (i) {
        tree.get(aFind[i], 1000, (obj) => {
            sum++
            console.log(obj)
            if (i == aFind.length - 1) {
                console.log(sum)
                now = Date.now()
                console.log('get :' + (now - lastTime) + ' ms')
                lastTime = now
            }
        })
    }(itemIndex)
}