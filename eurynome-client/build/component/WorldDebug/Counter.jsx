/* eslint-disable no-unused-vars */
const m = require('mithril')
const { Button, Card } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class WorldDebugCounter {
  constructor () {
    this.id = 'WorldDebugCounter'
  }

  view (vnode) {
    this.state = vnode.attrs.state || {}

    return (
      <Card id={this.id}>
        <span>shared counter:</span>
        <span>{this.state.count}</span>
        <Button
          onclick={() => {
            window.io.emit('handle-world-event', {
              name: 'counter',
              world: 'debug',
              payload: {
                key: 'count',
                value: ++this.state.count
              }
            })
          }}
          label="INCREMENT"
        />
        <Button
          onclick={() => {
            window.io.emit('handle-world-event', {
              name: 'counter',
              world: 'debug',
              payload: {
                key: 'count',
                value: --this.state.count
              }
            })
          }}
          label="DECREMENT"
        />
      </Card>
    )
  }
}
