var d3 = require('d3-quadtree')
var w = 1000
var h = 1000
var tree = d3.quadtree()

var a = []
var b = []
var lastTime = Date.now()
for (var i = 0; i < 1000000; i++) {
    a.push([
        w * Math.random(),
        h * Math.random(),
        'qwe'
    ])
}
var now = Date.now()
console.log('init a takes ' + (now - lastTime) + ' ms')
lastTime = now

for (var i = 0; i < 1000; i++) {
    b.push([
        w * Math.random(),
        h * Math.random()
    ])
}
now = Date.now()
console.log('init b takes ' + (now - lastTime) + ' ms')
lastTime = now

var aIns = b
var aFind = b

    !(new Array(100)).fill(1).map(() => {
        tree.addAll(aIns)
    })
now = Date.now()
console.log('insertion takes ' + (now - lastTime) + ' ms')
lastTime = now



    !(new Array(100)).fill(1).map(() => {
        for (var j in aFind) {
            var obj = tree.find(aFind[j][0], aFind[j][1], 100)
            if (obj) {
                // console.log("did not get")
                // console.log(obj)
            }
        }
    })

now = Date.now()
console.log('get takes ' + (now - lastTime) + ' ms')
lastTime = now