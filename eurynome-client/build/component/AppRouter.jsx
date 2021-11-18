/* eslint-disable no-unused-vars */
const m = require('mithril')
const RouteSplash = require('./RouteSplash')
const RouteWorld = require('./RouteWorld')
const CreateCharacter = require('./CreateCharacter')
const SelectCharacter = require('./SelectCharacter')
const SelectWorld = require('./SelectWorld')
/* eslint-enable no-unused-vars */

module.exports = class AppRouter {
  constructor () {
    this.id = 'AppRouter'
  }

  oncreate () {
    m.route(document.getElementById('AppRouter'), '/splash', {
      '/splash': RouteSplash,
      '/world': RouteWorld,
      '/select-world': SelectWorld,
      '/select-character': SelectCharacter,
      '/create-character': CreateCharacter
    })
  }

  view () {
    return (
      <main id={this.id}></main>
    )
  }
}
