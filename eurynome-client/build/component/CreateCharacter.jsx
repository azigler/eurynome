/* eslint-disable no-unused-vars */
const m = require('mithril')
const ButtonBack = require('./ButtonBack')
const { Form, Card, FormGroup, Input, FormLabel, Button, Tag } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class CreateCharacter {
  constructor () {
    this.id = 'CreateCharacter'

    this.errorSfx = window.$eu.sfx.get('error')

    window.io.once('new-character-initialized', (data) => {
      window.$eu.store.set('characters', [...window.$eu.store.get('characters'), data])
      m.route.set(`/world?world=${data.world}&char=${data.name}`)
    })

    window.io.on('character-name-taken', () => {
      this.error = 'name is taken'
      this.errorSfx.play()
      m.redraw()
    })
  }

  onremove () {
    window.io.off('new-character-initialized')
    window.io.off('character-name-taken')
  }

  view () {
    this.world = m.route.param('world')
    const buttonSfx = window.$eu.sfx.get('button')

    return (
      <div id={this.id}>
        <link href={`./min/css/${this.id}.css`} rel="stylesheet"></link>
        <h3>create a character</h3>
        <Card>
          <Form
            onsubmit={(e) => {
              e.preventDefault()
            }}
          >
            <FormGroup>
              <FormLabel
                for="name"
              >
              name
              </FormLabel>
              <Input
                id="name"
                name="name"
                intent={this.error ? 'error' : ''}
                placeholder="..."
                maxlength="15"
                oninput={(e) => {
                  this.name = e.target.value
                }}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel
                for="world"
              >
              world
              </FormLabel>
              <Tag
                label={this.world}
              />
            </FormGroup>
            <FormGroup class="error">
              <div class="error-message">{this.error}</div>
            </FormGroup>
            <FormGroup
              class="button-holder"
            >
              <ButtonBack route={`/select-character?world=${this.world}`} />
              <Button
                type="submit"
                label="submit"
                intent="positive"
                onclick={() => {
                  if (this.name.length < 3) {
                    this.error = 'name is too short'
                    this.errorSfx.play()
                    m.redraw()
                    return
                  }

                  window.io.emit('create-new-character', {
                    name: this.name,
                    world: this.world
                  })
                  buttonSfx.play()
                }}
              />
            </FormGroup>
          </Form>
        </Card>
      </div>
    )
  }
}
