/* eslint-disable no-unused-vars */
const m = require('mithril')
const io = require('socket.io-client')
/* eslint-enable no-unused-vars */

module.exports = class AppSocket {
  constructor () {
    this.id = 'AppWebSocket'
    window.io = io(process.env.DEVELOPMENT ? 'http://localhost:6177' : 'http://localhost:6177')

    this.log('Attempting connection to server...')

    m.route.set('/splash')

    window.io.on('connect', () => {
      this.log('Connected to server!')
      window.$eu.stream.connection(true)
    })

    window.io.on('reconnecting', () => {
      this.log('Attempting reconnection to server!')
    })

    window.io.on('disconnect', () => {
      window.$eu.stream.connection(false)
      if (m.route.get() !== '/splash') {
        this.resetLog()
      }
      this.log('Disconnected from server!')
      m.route.set('/splash')
    })

    window.io.on('duplicate-socket', () => {
      this.log('This client was already connected! Closing that connection...')
    })

    window.io.on('eurynome-handshake', () => {
      const uuid = window.$eu.store.get('uuid')
      if (uuid) {
        window.io.emit('eurynome-handshake', uuid)
        this.log(`Handshaking with client uuid:\n${uuid}`)
      } else {
        window.io.emit('initialize-new-client')
        this.log('Requesting new client uuid...')
      }
    })

    window.io.on('new-client-initialized', (data) => {
      window.$eu.stream.connection(data)
      window.$eu.store.set('uuid', data.uuid)

      this.log(`Assigned new client uuid:\n${data.uuid}`)
      this.log('You can now enter...')
    })

    window.io.on('handshake-recognized', (data) => {
      window.$eu.stream.connection(data)

      this.log(`Recognized with client uuid:\n${data.uuid}`)
      this.log('You can now enter...')
    })

    window.io.on('pong', (ms) => {
      window.$eu.stream.latency(ms)
      m.redraw()
    })

    window.io.on('connected-clients', (data) => {
      window.$eu.stream.connectedClients(data.clients)
      m.redraw()
    })

    window.io.on('connected-characters', (data) => {
      window.$eu.stream.connectedCharacters(data.characters)
      m.redraw()
    })

    window.io.on('available', (data) => {
      window.$eu.stream.availableCharacters(data.characters)
      window.$eu.stream.availableWorlds(data.worlds)
      m.redraw()
    })
  }

  log (message, type = 'connection') {
    console.log(message)
    const stream = window.$eu.stream[`${type}Log`]
    stream([...stream(), message])
    m.redraw()
  }

  resetLog (type = 'connection') {
    console.log(`Resetting ${type} log!`)
    window.$eu.stream[`${type}Log`]([])
    m.redraw()
  }

  view () {}
}
