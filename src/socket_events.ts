import EventEmitter from 'eventemitter3'

class SocketEventsClass extends EventEmitter {
  constructor() {
    super()
  }
}

var SocketEvents = new SocketEventsClass()
export default SocketEvents
