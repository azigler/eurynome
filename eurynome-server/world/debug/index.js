module.exports = {
  available: [
    '2c68201e-1990-484d-9f05-f6f5ddcc30cd',
    '8d881244-027d-4a5d-aee6-2add904212e0'
  ],

  maxCharacters: 1000,

  state: {
    count: 0
  },

  init ({ character }) {
    character.socket.on('handle-world-event', (data) => this.handle({ data, character }))

    character.socket.emit('world-state', {
      world: 'debug',
      state: this.state
    })
  },

  handle ({ data, character }) {
    if (data.world === 'debug') {
      this.scene.get(data.name).handle({ data, character })
    }
  }
}
