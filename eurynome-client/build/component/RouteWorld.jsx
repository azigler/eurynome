/* eslint-disable no-unused-vars */
const m = require('mithril')
const WorldSidebar = require('./WorldSidebar')
const WorldDebugMain = require('./WorldDebug/Main')
/* eslint-enable no-unused-vars */

module.exports = class RouteWorld {
  constructor () {
    this.id = 'RouteWorld'
    this.world = m.route.param('world')
    this.character = m.route.param('char')
    this.worldMain = ''

    window.io.on('world-state', (data) => {
      this.state = { ...data.state, character: this.character, world: this.world }
      m.redraw()
    })

    window.io.emit('enter-world', {
      character: this.character,
      world: this.world
    })
  }

  onremove () {
    window.io.off('world-state')
  }

  view () {
    switch (this.world) {
      case 'debug': this.worldMain = WorldDebugMain
        break
    }

    return (
      <div id={this.id}>
        <WorldSidebar state={this.state}/>
        <this.worldMain state={this.state} />
      </div>
    )
  }
}
