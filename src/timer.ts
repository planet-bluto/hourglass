import EventEmitter from 'eventemitter3'
import { reactive } from 'vue'
import { clamp, lerp } from './maths'
import { colorMixer, hexLerp, hexToRgb, rgbToHex } from './colors'
import { Settings } from './settings'
import { playSound } from './sounds'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

// export var Settings.durations.active = 10 * SECOND
// export var Settings.durations.break = 5 * SECOND
// export var Settings.durations.long_break = 7 * SECOND

// var Settings.durations.active = 35 * MINUTE + 30 * SECOND
// var Settings.durations.break = 5 * MINUTE
// var Settings.durations.long_break = 25 * MINUTE + 15 * SECOND
export var LONG_BREAK_INTERVAL = 3

enum TimerState {
  ACTIVE,
  SHORT_BREAK,
  LONG_BREAK
}

// var getTIMES() = [Settings.durations.active, Settings.durations.break, Settings.durations.long_break]
function getTIMES() {
  return [Settings.durations.active, Settings.durations.break, Settings.durations.long_break]
}

const DEBUGGING = true
const telementary = (...args: any[]) => {
  if (DEBUGGING) {
    console.log(...args)
  }
}

export class TimerClass extends EventEmitter {
  TIMES: number[] = getTIMES()
  _current_int: number = -1
  _start_timestamp: number = -1
  _remaining_time: number = 0
  time: number = Settings.durations.active
  state: TimerState = TimerState.ACTIVE
  paused: boolean = false
  seeked: boolean = false
  paused_seek: boolean = false
  ended: boolean = false
  ended_seek: boolean = false
  running: boolean = false
  breaks: number = 0
  target_color: number[] = hexToRgb('#3b3b3b')
  current_color: number[] = hexToRgb('#3b3b3b')
  current_color_hex: string = '#3b3b3b'
  getTIMES: Function = getTIMES

  constructor() {
    super()
    this.time = Settings.durations.active
  }

  _getPerc() {
    return (getTIMES()[this.state] - this.time) / getTIMES()[this.state]
  }

  _currentState(): 'INACTIVE' | 'LONG_BREAK' | 'BREAK' | 'ACTIVE' {
    let color_state: 'INACTIVE' | 'LONG_BREAK' | 'BREAK' | 'ACTIVE' = !Timer.running
      ? 'INACTIVE'
      : Timer.state > 0
        ? Timer.state > 1
          ? 'LONG_BREAK'
          : 'BREAK'
        : 'ACTIVE'
    return color_state
  }

  _getCSSColors(num: 1 | 2 | 3) {
    return rgbToHex(Timer.current_color[0], Timer.current_color[1], Timer.current_color[2])
  }

  _nextState(write: boolean = false) {
    let return_state: TimerState
    if (this.state == 0) {
      if ((this.breaks - (LONG_BREAK_INTERVAL - 1)) % LONG_BREAK_INTERVAL == 0) {
        return_state = TimerState.LONG_BREAK
      } else {
        return_state = TimerState.SHORT_BREAK
      }

      if (write) {
        this.breaks += 1
      }
    } else {
      return_state = TimerState.ACTIVE
    }

    if (write) {
      this.state = return_state
      this.time = getTIMES()[return_state]
    }

    return return_state
  }

  _interval() {
    Timer.time = Timer.time - SECOND
    Timer.time = Math.round(Timer.time / SECOND) * SECOND
    Timer.time = clamp(Timer.time, 0, Infinity)
    Timer.emit('tick', Timer.time)
    telementary(Timer, ' Timer at ', Timer.time)
    if (Timer.time <= 0) {
      Timer._end()
    }
  }

  _end() {
    let oldState = Timer._currentState()
    Timer._nextState(true)
    let newState = Timer._currentState()
    Timer.pause(false)

    Timer._remaining_time = getTIMES()[Timer.state]
    Timer.ended = true

    Timer.emit('ended', oldState, newState)
    telementary('Timer Ended!')
  }

  seek(perc: number) {
    if (Timer.paused) {
      Timer.paused_seek = true
    }
    Timer.pause(false)
    let ms = lerp(perc, getTIMES()[this.state], 0)

    Timer._remaining_time = ms
    Timer._start_timestamp = Timer._remaining_time - getTIMES()[this.state] + Date.now()
    Timer.seeked = true
    if (Timer.ended) {
      Timer.ended_seek = true
    }
  }

  doneSeeking() {
    Timer.start()
  }

  getTime() {
    return clamp(
      this.running
        ? getTIMES()[this.state] - (Date.now() - this._start_timestamp)
        : this._remaining_time,
      0,
      getTIMES()[this.state]
    )
  }

  start() {
    console.log(Timer.seeked, Timer.paused, Timer.paused_seek)

    telementary(
      'Timer Started!' + (Timer.paused ? ' [PAUSED]' : '') + (Timer.seeked ? ' [SEEKED]' : '')
    )
    this.running = true

    let fromNow = Timer.paused || Timer.seeked ? this._remaining_time : getTIMES()[this.state]
    if (!Timer.seeked) {
      this._start_timestamp =
        Date.now() - (Timer.paused ? getTIMES()[this.state] - this._remaining_time : 0)
    } else {
      this._start_timestamp = Timer._remaining_time - getTIMES()[this.state] + Date.now()
    }
    Timer._current_int = setTimeout(Timer._end, fromNow)

    Timer.emit('start')

    Timer.paused = false
    Timer.paused_seek = false
    Timer.seeked = false
    Timer.ended = false
    Timer.ended_seek = false
  }

  pause(true_pause = true) {
    if (true_pause) {
      this.paused = true
    }
    console.log('Cancel the fucking timeout')
    clearTimeout(Timer._current_int)
    clearInterval(Timer._current_int)
    if (this.running) {
      Timer.emit('pause', Timer.time)
    }
    this.running = false
    this._remaining_time = getTIMES()[this.state] - (Date.now() - this._start_timestamp)
  }

  skip() {
    let oldState = Timer._currentState()
    Timer._nextState(true)
    let newState = Timer._currentState()
    Timer.pause(false)
    this._remaining_time = getTIMES()[this.state]

    Timer.emit('skip', oldState, newState)
  }

  reset() {
    let oldState = Timer._currentState()
    Timer.pause(false)
    this._remaining_time = getTIMES()[this.state]

    Timer.emit('reset', oldState)
  }
}

var Timer = reactive(new TimerClass())
export default Timer

var prevTime = Timer.getTime()

function getSeconds(ms) {
  return Math.floor(ms / 1000.0)
}

function zeroPad(str: string) {
  if (str.length < 2) {
    return '0' + str
  } else {
    return str
  }
}

function timerText(raw_ms: number, padMinute = true) {
  let ms = raw_ms + 950

  const HOURS = Math.floor(ms / HOUR)
  const MINUTES = Math.floor((ms - HOUR * HOURS) / MINUTE)
  const SECONDS = Math.floor((ms - HOUR * HOURS - MINUTES * MINUTE) / SECOND)

  return `${HOURS > 0 ? `${HOURS}:` : ''}${!padMinute && HOURS == 0 ? MINUTES : zeroPad(String(MINUTES))}:${zeroPad(String(SECONDS))}`
}

function updateTime() {
  Timer.time = Timer.getTime()

  if (getSeconds(Timer.time) < getSeconds(prevTime)) {
    document.title = 'Hourglass - ' + timerText(Timer.time, false)
    if (Timer.time <= 3000) {
      playSound('countdown_3')
    } else if (Timer.time <= 10000) {
      playSound('countdown_10')
    }
  }

  prevTime = Timer.time

  // requestAnimationFrame(updateTime)
}

setInterval(updateTime, 5)

function colorUpdate() {
  let color_state = Timer._currentState()

  let color_dict = {
    INACTIVE: '#3b3b3b',
    ACTIVE: Settings.colors.active,
    BREAK: Settings.colors.break,
    LONG_BREAK: Settings.colors.long_break
  }

  Timer.target_color = hexToRgb(color_dict[color_state])
  let current = JSON.parse(JSON.stringify(Timer.current_color))
  let target = JSON.parse(JSON.stringify(Timer.target_color))

  Timer.current_color = colorMixer(current, target, 0.1)
  Timer.current_color_hex = rgbToHex(
    Timer.current_color[0],
    Timer.current_color[1],
    Timer.current_color[2]
  )

  // console.log(`${Timer.current_color} => ${Timer.target_color}`)

  requestAnimationFrame(colorUpdate)
}
colorUpdate()
// setInterval(colorUpdate, 100)
