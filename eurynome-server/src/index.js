const CharacterManager = require('./CharacterManager')
const ClientManager = require('./ClientManager')
const DatabaseManager = require('./DatabaseManager')
const DiscordManager = require('./DiscordManager')
const SocketManager = require('./SocketManager')
const WorldManager = require('./WorldManager')

module.exports = class EurynomeServer extends require('events') {
  constructor () {
    super()

    this.on('start', () => {
      this.startTime = new Date()
      console.log(`[%] Starting Eurynome @ ${this.startTime}`)
      this.secondsPerLoop = 30
      this.gameLoop = setInterval(this.loop.bind(this), this.secondsPerLoop * 1000)
    })

    this.on('stop', () => {
      console.log(`[%] Stopping Eurynome @ ${new Date()}`)
      clearTimeout(this.gameLoop)
      this.gameLoop = false
    })

    this.managers = new Map([
      ['DatabaseManager', new DatabaseManager({ server: this })],
      ['SocketManager', new SocketManager({ server: this })],
      ['ClientManager', new ClientManager({ server: this })],
      ['WorldManager', new WorldManager({ server: this })],
      ['CharacterManager', new CharacterManager({ server: this })],
      ['DiscordManager', new DiscordManager({ server: this })]
    ])

    this.M_character = this.managers.get('CharacterManager')
    this.M_client = this.managers.get('ClientManager')
    this.M_database = this.managers.get('DatabaseManager')
    this.M_discord = this.managers.get('DiscordManager')
    this.M_socket = this.managers.get('SocketManager')
    this.M_world = this.managers.get('WorldManager')
  }

  loop () {
    console.log(`[#] Looping @ ${new Date()}`)
  }

  start () {
    this.emit('start')
  }

  stop () {
    this.emit('stop')
  }
}
