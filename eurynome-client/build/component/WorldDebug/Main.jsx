/* eslint-disable no-unused-vars */
const m = require('mithril')
const WorldDebugCounter = require('./Counter')
const Dicebox = require('../Dicebox')
/* eslint-enable no-unused-vars */

module.exports = class WorldDebugMain {
  constructor () {
    this.id = 'WorldDebugMain'
  }

  view (vnode) {
    this.state = vnode.attrs.state || {}

    return (
      <main id={this.id}>
        <link href={`./min/css/${this.id}.css`} rel="stylesheet"></link>
        <div class="scenes">
          <WorldDebugCounter state={this.state} />
          <Dicebox state={this.state} shared="true" />
        </div>
        <a href="#!/select-world" onclick={() => window.io.emit('remove-character', this.state.character)}>
          <span>exit</span>
        </a>
      </main>
    )
  }
}
