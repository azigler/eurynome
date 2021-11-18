const fs = require('fs')
const Scene = require('./Scene')

module.exports = class SceneManager extends Map {
  constructor ({ server, world }) {
    super()
    this.server = server
    this.world = world

    fs.readdirSync(`./world/${this.world.name}`)
      .filter(scene => scene !== 'index.js')
      .map(scene => {
        this.addScene(scene.split('.')[0])
      })

    if (this.world.name === 'shared') {
      console.log('~~~ Loaded shared SceneManager')
    } else {
      console.log(`~~~ Loaded SceneManager for ${this.world.name} world`)
    }
  }

  addScene (name) {
    const newScene = new Scene({ server: this.server, name, world: this.world })
    this.set(name, newScene)

    console.log(`[^] Added ${name} scene to ${this.world.name} SceneManager`)
  }

  removeScene (scene) {
    this.delete(scene.name)

    console.log(`[v] Removed ${scene.name} from ${this.world.name} SceneManager`)
  }
}
