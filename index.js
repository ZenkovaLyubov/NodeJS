import http from 'http'
import fs from 'fs'
import path from 'path'
import { Transform } from 'stream'

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

http
  .createServer((request, response) => {
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

  .listen(port, host, () =>
    console.log(`Сервер запущен http://${host}:${port}`)
  )
