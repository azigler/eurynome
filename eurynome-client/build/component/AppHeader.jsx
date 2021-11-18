/* eslint-disable no-unused-vars */
const fs = require('fs')
const m = require('mithril')
/* eslint-enable no-unused-vars */

module.exports = class AppHeader {
  constructor () {
    this.id = 'AppHeader'
  }

  view () {
    const latency = window.$eu.stream.latency()
    const version = JSON.parse(fs.readFileSync((process.env.DEVELOPMENT ? './package.json' : `${process.resourcesPath}/app.asar/package.json`))).version

    return (
      <header id={this.id}>
        <link href={`./min/css/${this.id}.css`} rel="stylesheet"></link>
        <img class="planet" src="./asset/image/planet.png" />
        <h1>euryno.me</h1>
        <a target="_blank" class="creator" rel="noopener noreferrer" href="https://twitter.com/andrewzigler">
          <h2>
            by Andrew Zigler
            <img class="twitter" src="./asset/image/twitter.png"/>
          </h2>
        </a>
        <div class="client-details">
          <h2 class="version">
              v{version}
          </h2>
          <h2 class="latency">
            {latency ? window.$eu.stream.latency() + 'ms' : ''}
          </h2>
        </div>
        <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/hrtfkfN">
          <img class="discord" src="./asset/image/discord.png"/>
        </a>
      </header>
    )
  }
}
