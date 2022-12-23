const { workerData, parentPort } = require('worker_threads')
const fs = require('fs')
const readline = require('readline')

const findIP = (ip) => {
  const readInterface = readline.createInterface({
    input: fs.createReadStream('./access_tmp.log'),
  })
  readInterface.on('line', function (line) {
    if (line.includes(ip)) {
      const writeStream = fs.createWriteStream(`./${ip}_requests.log`, {
        flags: 'a',
        encoding: 'utf8',
      })
      writeStream.write(line)
      writeStream.write('\n')
    }
  })
  return `Файл ${ip}_requests.log сформирован`
}
parentPort.postMessage(findIP(workerData.ip))
