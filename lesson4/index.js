import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import readline from 'readline'
import { Worker } from 'worker_threads'

const rl = readline.createInterface(process.stdin, process.stdout)
rl.question('Укажите каталог: ', (dirname) => {
  const dir = dirname ? dirname : process.cwd()
  const files = fs.readdirSync(dir)

  requirerPrompt(dir, files)
})

const isFile = (dir, answer) => {
  if (fs.lstatSync(path.join(dir, answer.filepath)).isFile()) return true
  return false
}

const requirerPrompt = (dir, files = []) => {
  inquirer
    .prompt([
      {
        name: 'filepath',
        type: 'list',
        message: 'Выберите файл: ',
        choices: files,
      },
    ])
    .then((answer) => {
      const filepath = path.join(dir, answer.filepath)
      if (isFile(dir, answer)) {
        const fileContent = fs.readFileSync(filepath).toString()
        console.log(fileContent)
        rl.close()

        if (fileContent.length) {
          const rl1 = readline.createInterface(process.stdin, process.stdout)

          rl1.question('Укажите строку для поиска: ', (strname) => {
            workerFind(fileContent, strname)
            rl1.close()
          })
        } else {
          console.log('Файл пуст')
        }
      } else if (fs.lstatSync(filepath).isDirectory()) {
        const dirContent = fs.readdirSync(filepath)

        if (dirContent.length) {
          requirerPrompt(filepath, dirContent)
        } else {
          console.log('Каталог пуст')
        }
      }
    })
}

function workerFind(fileContent, strname) {
  const worker = new Worker('./worker.js', {
    workerData: { fileContent: fileContent, strname: strname },
  })
  worker.on('message', (result) => console.log(result))
}
