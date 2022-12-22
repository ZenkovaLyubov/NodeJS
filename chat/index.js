const http = require('http')
const fs = require('fs')
const io = require('socket.io')
const path = require('path')

const app = http.createServer((request, response) => {
  if (request.method === 'GET') {
    const filePath = path.join(__dirname, 'index.html')
    readStream = fs.createReadStream(filePath)
    readStream.pipe(response)
  } else if (request.method === 'POST') {
    let data = ''
    request.on('data', (chunk) => {
      data += chunk
    })
    request.on('end', () => {
      const parsedData = JSON.parse(data)
      response.writeHead(200, { 'Content-Type': 'json' })
      response.end(data)
    })
  } else {
    response.statusCode = 405
    response.end()
  }
})

const socket = io(app)
const users = []
socket.on('connection', function (socket) {
  console.log('New connection')

  socket.broadcast.emit('newConnEvent', { msg: 'The new client connected' })

  socket.on('disconnect', function () {
    console.log('A user disconnected')
    socket.broadcast.emit('newDisconnEvent', {
      msg: 'The client disconnected',
    })
  })

  socket.on('setUsername', function (data) {
    if (users.indexOf(data) === -1) {
      users.push(data)
      socket.emit('userSet', { username: data })
    } else {
      socket.emit(
        'userExists',
        data + ' username is taken! Try some other username.'
      )
    }
  })
  socket.on('msg', function (data) {
    // socket.broadcast.emit('newmsg', data)
    socket.broadcast.emit('newmsg', data)
  })
})

app.listen(3000, () => {
  console.log('listening port :3000')
})
