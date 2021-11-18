/* eslint-disable no-unused-vars */
const m = require('mithril')
const { Card, Button } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class RouteSplash {
  constructor () {
    this.id = 'RouteSplash'
  }

  view () {
    const connection = window.$eu.stream.connection()
    const connectionLog = [...window.$eu.stream.connectionLog()]
    const buttonSfx = window.$eu.sfx.get('button')
    const bgMusic = window.$eu.music.getRandom()

    let status = ''
    if (typeof connection === 'object') {
      status = 'recognized'
    } else if (connection === false) {
      status = 'disconnected'
    } else if (connection === true) {
      status = 'connected'
    }

    return (
      <div id={this.id} class="eu-route">
        <link href={`./min/css/${this.id}.css`} rel="stylesheet"></link>
        <Card>
          client status: <span class={`client-status ${status}`}>{status.toUpperCase()}</span>
          <Button
            disabled={typeof connection !== 'object'}
            href="#!/select-world"
            label="enter"
            onclick={() => {
              buttonSfx.play()
              if (!process.env.DEVELOPMENT) bgMusic.play()
            }}
          />
        </Card>
        <Card class="connection-log">
          {connectionLog.reverse().map((value, index) => {
            return <pre key={index}>{value}</pre>
          })}
        </Card>
      </div>
    )
  }
}
