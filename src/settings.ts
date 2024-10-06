interface SettingsObject {
  durations: {
    active: number
    break: number
    long_break: number
  }
  colors: {
    active: string
    break: string
    long_break: string
  }
  sounds_enabled: boolean
  desktop_notifications_enabled: boolean
  web_socket_enabled: boolean
  web_socket: {
    port: number
  }
}

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

const DEFAULT_SETTINGS: SettingsObject = {
  durations: {
    active: 25 * MINUTE,
    break: 5 * MINUTE,
    long_break: 15 * MINUTE
  },
  colors: {
    active: '#FFE737',
    break: '#024aca',
    long_break: '#25e2cd'
  },
  sounds_enabled: true,
  desktop_notifications_enabled: true,
  web_socket_enabled: true,
  web_socket: {
    port: 4687
  }
}

export var Settings: SettingsObject
var stored_settings = localStorage.getItem('settings')
if (stored_settings == null) {
  Settings = DEFAULT_SETTINGS
  localStorage.setItem('settings', JSON.stringify(DEFAULT_SETTINGS))
} else {
  Settings = JSON.parse(stored_settings)
}

// ----------------------------------------------------------- //

import EventEmitter from 'eventemitter3'
import Timer from './timer'
import SocketEvents from './socket_events'
// import { SocketManager } from './socket'
// import SocketEvents from './socket'

class SettingsEventsClass extends EventEmitter {
  constructor() {
    super()
  }
}

export var SettingsEvents = new SettingsEventsClass()

function durString(durations: object) {
  return `${durations.active}-${durations.break}-${durations.long_break}`
}

var oldDurations = durString(Settings.durations)
var oldPort = Settings.web_socket.port
var oldWSEnabled = Settings.web_socket_enabled

function tryWSStart(close = false) {
  if (Settings.web_socket_enabled) {
    console.log('Trying to start...', SocketEvents)
    SocketEvents.emit('web_socket_start')
  } else if (close) {
    console.log('Trying to close...', SocketEvents)
    SocketEvents.emit('web_socket_close')
  }
}

export function updateSettings() {
  var newDurations = durString(Settings.durations)
  var newPort = Settings.web_socket.port
  var newWSEnabled = Settings.web_socket_enabled

  localStorage.setItem('settings', JSON.stringify(Settings))

  if (oldDurations != newDurations) {
    oldDurations = newDurations
    Timer.reset()
  }

  console.log(oldPort, newPort)
  console.log(oldWSEnabled, newWSEnabled)

  if (oldPort != newPort) {
    oldPort = newPort
    tryWSStart()
  }

  if (oldWSEnabled != newWSEnabled) {
    oldWSEnabled = newWSEnabled
    tryWSStart(true)
  }
}
