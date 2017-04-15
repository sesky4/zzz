var bb = require('../system/byteBuffer')

var buff = new bb()
buff.append(Buffer.from('abc'))
console.log(buff.read(2))
buff.readAndRemove(1)
console.log(buff.read(2))