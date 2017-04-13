var str = 'qweewqqwe123'

var buff = Buffer.from(str)
console.log(buff)
console.log(buff.length)

var newBuff = new Buffer(2)
newBuff.writeUInt16LE(65534)

var t = Buffer.concat([newBuff, buff])
console.log(t)
console.log(t.length)