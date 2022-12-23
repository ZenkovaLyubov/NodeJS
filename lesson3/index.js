const { Worker } = require('worker_threads')

const ip = ['89.123.1.41', '34.48.240.111']
for (let i = 0; i < ip.length; i++) {
  findWorker(ip[i])
}

function findWorker(ip) {
  const worker = new Worker('./worker.js', {
    workerData: { ip: ip },
  })

  worker.on('message', (result) => console.log(result))
}
