module.exports = class Scene {
  constructor ({ server, name, world }) {
    this.server = server
    this.name = name
    this.world = world

    this.config = require(`./../world/${this.world.name}/${this.name}.js`)
    Object.assign(this, this.config)
    delete this.config
  }
}
