var a = []
for (var i = 0; i < 10000000; i++) {
    a[i] = i
}
console.log('define over')
setTimeout(() => {
    a = null
    global.gc()
    console.log('set over')
    while (1) {
        // a[4] = 123
    }
}, 3000)