module.exports = {
  UPDATE_VALUE ({ character, data }) {
    character.world.state[data.payload.key] = data.payload.value
  }
}
