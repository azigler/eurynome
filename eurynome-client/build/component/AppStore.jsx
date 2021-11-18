/* eslint-disable no-unused-vars */
const m = require('mithril')
const Store = require('electron-store')
const stream = require('mithril/stream')
/* eslint-enable no-unused-vars */

module.exports = class AppStore {
  constructor () {
    this.id = 'AppStore'

    window.$eu.store = new Store({
      name: `store${process.env.DEVELOPMENT ? '-dev' : ''}`,
      encryptionKey: 'eu_',
      defaults: {
        characters: []
      }
    })

    window.$eu.stream = {
      availableCharacters: stream([]),
      availableWorlds: stream([]),
      connection: stream(false),
      connectionLog: stream([]),
      connectedClients: stream([]),
      connectedCharacters: stream([]),
      latency: stream(),

      diceLog: stream([])
    }
  }

  view () {}
}
