/* eslint-disable no-unused-vars */
const m = require('mithril')
const AppAudio = require('./AppAudio')
const AppRouter = require('./AppRouter')
const AppHeader = require('./AppHeader')
const AppStore = require('./AppStore')
const AppSocket = require('./AppSocket')
const { FocusManager } = require('construct-ui')
/* eslint-enable no-unused-vars */

FocusManager.showFocusOnlyOnTab()

module.exports = class App {
  constructor () {
    this.id = 'App'
    window.$eu = {}
  }

  view () {
    return (
      <div id={this.id}>
        <link href={`./min/css/${this.id}.css`} rel="stylesheet"></link>
        <AppStore />
        <AppAudio />
        <AppSocket />
        <AppHeader />
        <AppRouter />
      </div>
    )
  }
}
