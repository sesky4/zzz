function getNg(lg, n) {
    return 0.5 * (lg + n / lg)
}

var x = 138.0
var lg = 1.0
var ng

// do {
//     lg = ng
//     ng = getNg(lg, x)
//     console.log(ng)

// } while (Math.abs(ng - lg) > 0.05)
while (1) {
    ng = getNg(lg, x)
    if (Math.abs(ng - lg) < 0.0005) {
        console.log(ng)
        break
    }
    lg = ng
}