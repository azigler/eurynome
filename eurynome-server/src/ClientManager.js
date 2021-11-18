const Client = require('./Client')

module.exports = class ClientManager extends Map {
  constructor ({ server }) {
    super()
    this.server = server

    this.server.on('start', () => {
      console.log('[#] Starting ClientManager...')
    })

    this.server.on('stop', () => {
      console.log('[#] Stopping ClientManager...')
      this.forEach(client => this.removeClient(client.uuid))
    })
  }

  initializeClient ({ socket, uuid }) {
    if (!uuid) console.log('[*] Initializing new client...')
    const client = new Client({ server: this.server, socket, uuid })
    if (!uuid) {
      socket.emit('new-client-initialized', { uuid: client.uuid })
      this.server.M_database.initDoc({
        db: 'client',
        id: client.uuid
      })
    }
    this.addClient(client)
  }

  addClient (client) {
    this.set(client.uuid, client)
    console.log(`[+] Added client to ClientManager: ${client.uuid}`)

    this.forEach(client => {
      client.socket.emit('connected-clients', { clients: [...this.keys()] })
    })
  }

  removeClient (uuid) {
    if (this.get(uuid).currentCharacter) this.server.M_character.removeCharacter(this.get(uuid).currentCharacter)

    this.delete(uuid)
    console.log(`[-] Removed client from ClientManager: ${uuid}`)

    this.forEach(client => {
      client.socket.emit('connected-clients', { clients: [...this.keys()] })
    })
  }
}
