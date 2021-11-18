/* eslint-disable no-unused-vars */
const m = require('mithril')
const GridCard = require('./GridCard')
const ButtonBack = require('./ButtonBack')
const { Button } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class SelectWorld {
  constructor () {
    this.id = 'SelectWorld'
  }

  view () {
    const availableWorlds = window.$eu.stream.availableWorlds()
    const buttonSfx = window.$eu.sfx.get('button')
    if (availableWorlds.length === 1) m.route.set(`/select-character?world=${availableWorlds[0]}`)

    if (availableWorlds.length === 0) {
      return (
        <div id={this.id} class="eu-select">
          <GridCard>
            <div>
              <span>No worlds are available.</span>
            </div>
          </GridCard>
          <ButtonBack route='/splash'/>
        </div>
      )
    }

    return (
      <div id={this.id} class="eu-select">
        <h3>select a world</h3>
        <GridCard>
          {availableWorlds.map((world, index) => {
            return (
              <a href={`#!/select-character?world=${world}`} key={index} onclick={() => {
                buttonSfx.play()
              }}>
                <span class="option">{world}</span>
              </a>
            )
          })}
        </GridCard>
        <ButtonBack route='/splash'/>
      </div>
    )
  }
}
