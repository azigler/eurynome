/* eslint-disable no-unused-vars */
const m = require('mithril')
const { Button, Card, Overlay, RadioGroup, FormLabel } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class Dicebox {
  constructor () {
    this.id = 'Dicebox'
    this.isOpen = false
  }

  log (message, type = 'dice') {
    const stream = window.$eu.stream[`${type}Log`]
    stream([...stream(), message])
    m.redraw()
  }

  resetLog (type = 'dice') {
    console.log(`Resetting ${type} log!`)
    window.$eu.stream[`${type}Log`]([])
    m.redraw()
  }

  rollDice ({ sides, amount, shared, world }) {
    window.io.emit('handle-world-event', {
      name: 'dicebox',
      world: 'shared',
      payload: {
        action: 'roll',
        sides,
        shared,
        world,
        amount
      }
    })
  }

  onremove () {
    window.io.off('dice-roll')
    window.io.off('dice-log-event')
  }

  view (vnode) {
    this.state = vnode.attrs.state || {}
    this.shared = vnode.attrs.shared || false

    this.amountSelected = this.amountSelected || 1
    this.sidesSelected = this.sidesSelected || 6

    const diceLog = [...window.$eu.stream.diceLog()]
    const diceSides = [4, 6, 8, 12, 20]
    const diceAmounts = [1, 2, 3, 4]

    return (
      <div class={this.id}>
        <link href={`./min/css/${this.id}.css`} rel="stylesheet"></link>
        <Overlay
          isOpen={this.isOpen}
          closeOnEscKey="true"
          closeOnOutsideClick="true"
          hasBackdrop="false"
          onClose={() => {
            this.isOpen = false
            window.io.off('dice-roll')
            window.io.off('dice-log-event')

            if (this.shared) {
              window.io.emit('handle-world-event', ({
                name: 'dicebox',
                world: 'shared',
                payload: {
                  action: 'leave',
                  shared: true,
                  world: this.state.world
                }
              }))
            }

            this.resetLog()
          }}
          content={(
            <Card class={this.id}>
              <div class="dice-log">
                {diceLog.reverse().map((value, index) => {
                  return <pre key={index}>{value}</pre>
                })}
              </div>
              <FormLabel
                for="dice-sides"
              >
              # of dice
              </FormLabel>
              <RadioGroup
                name="dice-number"
                options={diceAmounts}
                value={this.amountSelected}
                onchange={(e) => { console.log(e.currentTarget.value); this.amountSelected = parseInt(e.currentTarget.value) }}
              />
              <FormLabel
                for="dice-sides"
              >
              sides per dice
              </FormLabel>
              <Button
                onclick={() => { console.log(this.shared); this.rollDice({ sides: 2, amount: 1, shared: this.shared, world: this.state.world }) }}
                class="coin-flip"
                label='coin flip'
                iconLeft='circle'
              />
              <RadioGroup
                name="dice-sides"
                options={diceSides}
                value={this.sidesSelected}
                onchange={(e) => { console.log(e.currentTarget.value); this.sidesSelected = parseInt(e.currentTarget.value) }}
              />
              <Button
                onclick={() => this.rollDice({ sides: this.sidesSelected, amount: this.amountSelected, shared: this.shared, world: this.state.world })}
                class="roll"
                label='roll'
              />
            </Card>
          )}
        />
        <Button
          onclick={() => {
            this.isOpen = true

            window.io.on('dice-log-event', (data) => {
              console.log('received')
              if (typeof data.log === 'object') {
                for (const log of data.log) {
                  this.log(log)
                }
              } else {
                this.log(data.log)
              }
            })

            if (this.shared) {
              window.io.emit('handle-world-event', ({
                name: 'dicebox',
                world: 'shared',
                payload: {
                  action: 'join',
                  shared: true,
                  world: this.state.world
                }
              }))
            }
          }}
          class="launch"
          label={`open ${this.shared ? 'shared' : 'my'} dicebox`}
        />
      </div>
    )
  }
}
