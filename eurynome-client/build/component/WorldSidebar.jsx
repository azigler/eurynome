/* eslint-disable no-unused-vars */
const m = require('mithril')
const CardConnected = require('./CardConnected')
const Dicebox = require('./Dicebox')
const { Icon } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class WorldSidebar {
  constructor () {
    this.id = 'WorldSidebar'

    this.boundToggleSidebar = this.toggleSidebar.bind(this)
    window.document.addEventListener('keyup', this.boundToggleSidebar)
  }

  onremove () {
    window.document.removeEventListener('keyup', this.boundToggleSidebar)
  }

  view (vnode) {
    this.state = vnode.attrs.state || {}

    return (
      <div id={this.id} class={`sidebar ${this.sidebarHidden ? 'hidden' : ''}`}>
        <link href={`./min/css/${this.id}.css`} rel="stylesheet"></link>
        <div class="sidebar-top">
          <span class="title">menu</span>
          <Icon name={`chevron-${this.sidebarHidden ? 'right' : 'left'}`} class={`${this.sidebarHidden ? 'toggled' : 'left'}`} onclick={() => {
            this.sidebarHidden = !this.sidebarHidden
            m.redraw()
          }}/>
        </div>
        <CardConnected type="character" world={this.state.world} />
        <CardConnected type="client" />
        <Dicebox state={this.state} />
      </div>
    )
  }

  toggleSidebar (e) {
    if (window.document.activeElement.type === 'text' || window.document.activeElement.type === 'textarea') return

    if (e.code === 'Backquote' || e.key === '`') {
      console.log('here')
      this.sidebarHidden = !this.sidebarHidden
      m.redraw()
    }
  }
}
