const { v4: uuidv4 } = require('uuid')

module.exports = class Client {
  constructor ({ server, socket, uuid }) {
    this.server = server
    this.socket = socket
    this.uuid = uuid || uuidv4()
    socket.uuid = this.uuid
    this.currentAddress = this.socket.handshake.address
    this.characters = []

    this.socket.on('disconnect', () => {
      this.server.M_client.removeClient(this.uuid)
    })

    this.socket.on('check-can-make-new-character', (data) => {
      const worldObject = this.server.M_world.get(data.world)

      const canMakeNewCharacter = this.characters.filter(char => char.world === data.world).length < worldObject.maxCharacters

      this.socket.emit('can-make-new-character', canMakeNewCharacter)
    })

    this.socket.on('create-new-character', (data) => {
      this.server.M_character.initializeCharacter({
        name: data.name,
        client: this,
        world: data.world
      })
    })

    this.socket.on('play-as-character', (data) => {
      const uuid = this.characters.filter(char => char.name === data.name)[0].uuid

      this.server.M_character.initializeCharacter({
        name: data.name,
        client: this,
        world: data.world,
        uuid
      })
    })

    this.hydrate()
  }

  emitAvailable () {
    const availableWorlds = []

    this.server.M_world.forEach(world => {
      if (world.name === 'shared') {
        return
      }

      const available = world.available
      const availableType = typeof available

      if (availableType === 'boolean' && available === true) {
        availableWorlds.push(world.name)
      }
      if (availableType === 'object' && world.available.includes(this.uuid)) {
        availableWorlds.push(world.name)
      }
    })

    const availableCharacters = this.characters

    this.socket.emit('available', {
      worlds: availableWorlds,
      characters: availableCharacters
    })
  }

  hydrate () {
    this.server.M_database.fetchDoc({
      db: 'client',
      id: this.uuid
    })
      .then((data) => {
        Object.assign(this, data)
        this.emitAvailable()
      })
  }

  serialize () {
    const addresses = (this.addresses && this.addresses.length > 1 ? Array.from(new Set([...this.addresses, this.currentAddress])) : [this.currentAddress])

    return {
      addresses,
      characters: this.characters
    }
  }

  update () {
    this.server.M_database.updateDoc({
      db: 'client',
      id: this.uuid,
      payload: this.serialize()
    })
  }
}
