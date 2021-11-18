module.exports = {
  handle ({ data, character }) {
    character.server.M_world.getMutation('UPDATE_VALUE')({ character, data })
    character.world.update()
  }
}
