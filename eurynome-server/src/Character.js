const { v4: uuidv4 } = require('uuid')

module.exports = class Character {
  constructor ({ server, uuid, name, client, world }) {
    this.server = server
    this.name = name
    this.client = client
    this.socket = client.socket
    this.uuid = uuid || uuidv4()
    this.world = world

    if (this.client.currentCharacter) this.server.M_character.removeCharacter(this.client.currentCharacter)
    this.client.currentCharacter = this

    this.hydrate()

    this.server.M_world.get('shared').init({
      character: this
    })

    this.socket.on('remove-character', (character) => {
      if (this.name === character) {
        this.server.M_character.removeCharacter(this)
        this.client.currentCharacter = undefined
        this.world.connectedCharacters.filter(char => char.name !== this.name)
      }
    })

    this.socket.on('enter-world', (data) => {
      if (this.name === data.character) {
        this.world.init({
          character: this
        })
        this.world.connectedCharacters.push({
          name: this.name,
          uuid: this.uuid,
          socket: this.socket
        })
      }
    })
  }

  hydrate () {
    this.server.M_database.fetchDoc({
      db: 'character',
      id: this.uuid
    })
      .then((data) => {
        delete data.client
        delete data.world
        Object.assign(this, data)
      })
  }

  serialize () {
    return {
      name: this.name,
      client: this.client.uuid,
      world: this.world.name
    }
  }

  update () {
    this.server.M_database.updateDoc({
      db: 'character',
      id: this.uuid,
      payload: this.serialize()
    })
  }
}
