const http = require('http')
const fs = require('fs')
const path = require('path')
const { Transform } = require('stream')
const io = require('socket.io')

const host = 'localhost'
const port = 3000

let filesList = []

const links = (list, curUrl) => {
  if (curUrl.endsWith('/')) curUrl = curUrl.substring(0, curUrl.length - 1)
  let link = ''
  for (const i of list) {
    link += `<li><a href="${curUrl}/${i}">${i}</a></li>`
  }
  return link
}

const app = http.createServer((request, response) => {
  if (request.method === 'GET') {
    const url = request.url.split('?')[0]
    const curPath = path.join(process.cwd(), url)

    fs.stat(curPath, (err, stats) => {
      if (!err) {
        if (stats.isFile(curPath)) {
          const rs = fs.createReadStream(curPath, 'utf-8')

          const ts = new Transform({
            transform(chunk, encoding, callback) {
              this.push('<a href="..">..</a>' + '\n' + chunk.toString())

              callback()
            },
          })
          rs.pipe(ts).pipe(response)
        } else {
          filesList = []
          const ds = fs.readdir(curPath, 'utf-8', (err, files) => {
            filesList = files
            if (url !== '/') filesList.unshift('..')
          })

          const filePath = path.join(process.cwd(), './index.html')
          const rs = fs.createReadStream(filePath)
          const ts = new Transform({
            transform(chunk, encoding, callback) {
              const li = links(filesList, url)

              this.push(chunk.toString().replace('#links#', li))

              callback()
            },
          })

          rs.pipe(ts).pipe(response)
        }
      } else {
        response.end('Error')
      }
    })
  }
})

const socket = io(app)
let clients = 0
socket.on('connection', function (socket) {
  clients++
  // socket.broadcast.emit('broadcast', {
  //   description: clients + ' clients connected!',
  // })
  socket.emit('countUsers', {
    description: clients + ' clients connected!',
  })
  socket.on('disconnect', function () {
    clients--
    socket.emit('broadcast', {
      description: clients + ' clients connected!',
    })
  })
})
app.listen(port, host, () =>
  console.log(`Сервер запущен http://${host}:${port}`)
)
