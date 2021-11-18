/* eslint-disable no-unused-vars */
const m = require('mithril')
const { Card } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class CardConnected {
  constructor () {
    this.id = 'CardConnected'
  }

  view (vnode) {
    const type = vnode.attrs.type

    let connected
    if (type === 'character') {
      const world = vnode.attrs.world

      connected = window.$eu.stream.connectedCharacters()
      return (
        <div class={this.id}>
          <Card>
            <span>{type}s:</span>
            <ul>
              {connected
                .filter(connected => connected.world === world)
                .map((connected, index) => {
                  return (<li key={index}>{connected.name}</li>)
                })}
            </ul>
          </Card>
        </div>
      )
    } if (type === 'client') {
      connected = window.$eu.stream.connectedClients()
      return (
        <div class={this.id}>
          <Card>
            <span>{type}s:</span>
            <ul>
              {connected.map((connected, index) => {
                return (<li key={index}>{connected}</li>)
              })}
            </ul>
          </Card>
        </div>
      )
    }
  }
}
