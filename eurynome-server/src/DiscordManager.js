module.exports = class DiscordManager extends Map {
  constructor ({ server }) {
    super()
    this.server = server

    this.server.on('start', () => {
      console.log('[#] Starting DiscordManager...')
    })
    this.server.on('stop', () => {
      console.log('[#] Stopping DiscordManager...')
    })
  }
}
