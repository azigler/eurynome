const fs = require('fs')
const World = require('./World')

module.exports = class WorldManager extends Map {
  constructor ({ server }) {
    super()
    this.server = server

    this.server.on('start', () => {
      console.log('[#] Starting WorldManager...')
      fs.readdirSync('./world')
        .map(worldName => {
          this.addWorld(worldName)
        })
    })

    this.server.on('stop', () => {
      console.log('[#] Stopping WorldManager...')
      this.forEach(world => this.removeWorld(world))
    })
  }

  getMutation (name) {
    return this.get('shared').scene.get('mutations')[name]
  }

  async addWorld (name) {
    const newWorld = new World({ server: this.server, name })

    if (name === 'shared') {
      return this.set(name, newWorld)
    }

    const worldExists = await this.server.M_database.fetchDoc({ db: 'world', id: name })
    if (worldExists.status === 404) {
      this.server.M_database.initDoc({
        db: 'world',
        id: name,
        payload: newWorld.serialize()
      })
    }

    this.set(name, newWorld)
    console.log(`*** Initialized ${name} world`)
  }

  removeWorld (world) {
    delete world.scene
    this.delete(world.name)
    if (world.name !== 'shared') {
      console.log(`*/* Deleted SceneManager from ${world.name} world`)
      console.log(`*/* Purged ${world.name} world`)
    } else {
      console.log('*/* Deleted shared SceneManager')
    }
  }
}
