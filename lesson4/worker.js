import { workerData, parentPort } from 'worker_threads'

const contentIncluds = (fileContent, strname) => {
  if (fileContent.includes(strname)) {
    return 'Строка есть в файле'
  } else {
    return 'Строки нет в файле'
  }
}
parentPort.postMessage(
  contentIncluds(workerData.fileContent, workerData.strname)
)
