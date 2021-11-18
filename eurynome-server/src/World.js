const SceneManager = require('./SceneManager')

module.exports = class World {
  constructor ({ server, name }) {
    this.server = server
    this.name = name
    this.scene = new SceneManager({ server: this.server, world: this })

    this.config = require(`./../world/${this.name}`)
    Object.assign(this, this.config)
    delete this.config

    this.hydrate()

    if (this.name === 'shared') return

    this.maxCharacters = 3
    this.connectedCharacters = []
  }

  hydrate () {
    if (this.name === 'shared') return

    this.server.M_database.fetchDoc({
      db: 'world',
      id: this.name
    })
      .then((data) => {
        this.name = data._id
        Object.assign(this, data)
      })
  }

  serialize () {
    if (this.name === 'shared') return

    return {
      maxCharacters: this.maxCharacters,
      available: this.available,
      state: this.state
    }
  }

  update () {
    if (this.name === 'shared') return

    this.server.M_database.updateDoc({
      db: 'world',
      id: this.name,
      payload: this.serialize()
    })

    this.connectedCharacters.forEach(char => char.socket.emit('world-state', {
      world: 'debug',
      state: this.state
    }))
  }
}
