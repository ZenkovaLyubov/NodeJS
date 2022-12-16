import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import readline from 'readline'

const rl = readline.createInterface(process.stdin, process.stdout)
rl.question('Укажите каталог: ', (dirname) => {
  const dir = dirname ? dirname : process.cwd()
  const files = fs.readdirSync(dir)

  requirerPrompt(dir, files)
})

const contentIncluds = (fileContent, strname) => {
  if (fileContent.includes(strname)) {
    console.log('Строка есть в файле')
  } else {
    console.log('Строки нет в файле')
  }
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
      if (fs.lstatSync(path.join(dir, answer.filepath)).isFile()) {
        const fileContent = fs
          .readFileSync(path.join(dir, answer.filepath))
          .toString()
        console.log(fileContent)
        rl.close()

        if (fileContent.length) {
          const rl1 = readline.createInterface(process.stdin, process.stdout)
          rl1.question('Укажите строку для поиска: ', (strname) => {
            contentIncluds(fileContent, strname)
            rl1.close()
          })
        } else {
          console.log('Файл пуст')
        }
      } else if (fs.lstatSync(path.join(dir, answer.filepath)).isDirectory()) {
        const dirContent = fs.readdirSync(path.join(dir, answer.filepath))

        if (dirContent.length) {
          requirerPrompt(path.join(dir, answer.filepath), dirContent)
        } else {
          console.log('Каталог пуст')
        }
      }
    })
}
