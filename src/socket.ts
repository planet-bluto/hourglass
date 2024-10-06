import { Settings } from './settings'
import SocketEvents from './socket_events'
import { playSound } from './sounds'
import Timer from './timer'
var io = require('socket.io')()

var status = false // generic...

io.on('connection', (socket: any) => {
  console.log('Hai :3')

  socket.on('get_status', (callback: Function) => {
    SocketEvents.emit('mao', status)
    callback(status) // <= gulp...
  })
})

// -------------------------------------------------------------- //

Timer.on('start', () => {
  io.emit('start', Timer._currentState(), Timer.getTIMES()[Timer.state], Timer._start_timestamp)
  playSound(`resume`)
})

Timer.on('ended', (oldState: string, newState: string) => {
  io.emit('ended', oldState, newState)
  playSound(`${newState.toLowerCase()}_start`)

  let notifs = {
    ACTIVE: { body: 'Time to get back to work!', image: '/imgs/active_notif.png' },
    BREAK: { body: 'Time to take a short break!', image: '/imgs/break_notif.png' },
    LONG_BREAK: { body: 'Time to take a long break!', image: '/imgs/long_break_notif.png' }
  }

  if (Settings.desktop_notifications_enabled) {
    new Notification('Hourglass Depleted!', {
      body: notifs[newState].body,
      image: notifs[newState].image
    })
  }
})

Timer.on('reset', (currentState) => {
  io.emit('reset', currentState)
  playSound(`reset`)
})

Timer.on('skip', (oldState, newState) => {
  io.emit('skip', oldState, newState)
  playSound(`skip`)
})

Timer.on('pause', (time) => {
  io.emit('pause', time)
  playSound(`pause`)
})

Timer.on('tick', (time) => {
  io.emit('tick', time)
})

// -------------------------------------------------------------- //

SocketEvents.on('web_socket_start', () => {
  console.log('Web Socket Start....')
  io.close()
  io.listen(Settings.web_socket.port)
})

SocketEvents.on('web_socket_close', () => {
  console.log('Web Socket Close....')
  io.close()
})

if (Settings.web_socket_enabled) {
  console.log('WEB SOCKET LISTENING...')
  io.listen(Settings.web_socket.port)
}
