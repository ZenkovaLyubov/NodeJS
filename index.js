import fs from 'fs'
import readline from 'readline'

const ip1 = '89.123.1.41'
const ip2 = '34.48.240.111'

const readInterface = readline.createInterface({
  input: fs.createReadStream('./access_tmp.log'),
})

readInterface.on('line', function (line) {
  if (line.includes(ip1)) {
    const writeStream = fs.createWriteStream(`./${ip1}_requests.log`, {
      flags: 'a',
      encoding: 'utf8',
    })
    writeStream.write(line)
    writeStream.write('\n')
  }
  if (line.includes(ip2)) {
    const writeStream = fs.createWriteStream(`./${ip2}_requests.log`, {
      flags: 'a',
      encoding: 'utf8',
    })
    writeStream.write(line)
    writeStream.write('\n')
  }
})
