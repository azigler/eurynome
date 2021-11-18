/* eslint-disable no-unused-vars */
const m = require('mithril')
const GridCard = require('./GridCard')
const ButtonBack = require('./ButtonBack')
const { Button } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class SelectCharacter {
  constructor () {
    this.id = 'SelectCharacter'
    this.newCharacterCardHtml = ''
    this.world = m.route.param('world')

    window.io.emit('check-can-make-new-character', { world: this.world })
    window.io.on('can-make-new-character', (data) => {
      data
        ? this.newCharacterCardHtml = (
          <GridCard class="new-char">
            {this.newCharacterCard(this.world)}
          </GridCard>
        )
        : this.newCharacterCardHtml = ''

      m.redraw()
    })
  }

  onremove () {
    window.io.off('can-make-new-character')
  }

  view () {
    const availableCharacters = window.$eu.stream.availableCharacters().filter(char => char.world === this.world) || []
    const availableWorlds = window.$eu.stream.availableWorlds()
    const buttonSfx = window.$eu.sfx.get('button')

    return (
      <div id={this.id} class="eu-select">
        <h3>select a character</h3>
        <GridCard>
          {availableCharacters.map((character, index) => {
            return (
              <a href={`#!/world?world=${this.world}&char=${character.name}`} key={index} onclick={() => {
                window.io.emit('play-as-character', { name: character.name, world: this.world })
                buttonSfx.play()
              }}>
                <span class="option">{character.name}</span>
              </a>
            )
          })}
        </GridCard>
        {this.newCharacterCardHtml}
        <ButtonBack route={this.handleBack(availableWorlds)}/>
      </div>
    )
  }

  handleBack (availableWorlds) {
    if (availableWorlds.length === 1) return '/splash'
    return '/select-world'
  }

  newCharacterCard (world) {
    const buttonSfx = window.$eu.sfx.get('button')

    return (
      <a href={`#!/create-character?world=${world}`} key="new-char" onclick={() => {
        buttonSfx.play()
      }}>
        <span class="option new-char">+ new character</span>
      </a>
    )
  }
}
