import { DateTime, Interval, Duration } from './luxon.js'
import EventEmitter from 'events'
const emitter = new EventEmitter()

emitter.on('timerStart', startTimer)
emitter.on('timerFinish', () => {
  clearInterval(timerId)
  console.log('Время вышло!')
})

function Start() {
  emitter.emit('timerStart')
}

Start()
function setTimeObj(year, month, day, hours, minutes, seconds) {
  return DateTime.fromObject({
    year: year,
    month: month,
    day: day,
    hour: hours,
    minutes: minutes,
    second: seconds,
  })
}

function timerMinus(objTime, countSeconds) {
  const durInterval = Duration.fromObject({ seconds: countSeconds })
  return objTime.minus(durInterval)
}

function printResult(obj) {
  console.log(
    obj.toFormat(
      "y 'year' M 'months' d 'days' h 'hours' m 'minutes' s 'seconds'"
    )
  )
}

function startTimer() {
  const [userHours, userDay, userMonth, userYear] = process.argv[2].split('-')
  const userMinutes = 0
  const userSeconds = 0

  const dtnow = DateTime.local()

  const dt = setTimeObj(
    userYear,
    userMonth,
    userDay,
    userHours,
    userMinutes,
    userSeconds
  )
  if (dt > dtnow) {
    let dt1 = Duration.fromObject({
      years: userYear - dtnow.year,
      months: userMonth - dtnow.month,
      days: userDay - dtnow.day,
      hours: userHours - dtnow.hour,
      minutes: 0,
      seconds: 0,
    })

    console.log('До истечения интервала осталось: ')
    printResult(dt1)
    let timerId = null
    timerId = setInterval(timerFunc, 1000)

    function timerFunc() {
      dt1 = timerMinus(dt1, 1)
      printResult(dt1)

      if (
        dt1.toFormat(
          "y 'year' M 'months' d 'days' h 'hours' m 'minutes' s 'seconds'"
        ) == "0 'year' 0 'months' 0 'days' 0 'hours' 0 'minutes' 0 'seconds'"
      ) {
        emitter.emit('timerFinish')
      }
    }
  } else {
    console.log('Укажите корректное время для таймера!')
    emitter.emit('timerFinish')
  }
}
