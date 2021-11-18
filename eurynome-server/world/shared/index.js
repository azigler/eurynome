module.exports = {
  init ({ character }) {
    character.socket.on('handle-world-event', (data) => this.handle({ data, character }))
  },

  handle ({ data, character }) {
    if (data.world === 'shared') {
      this.scene.get(data.name).handle({ data, character })
    }
  }
}
