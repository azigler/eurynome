/* eslint-disable no-unused-vars */
const fs = require('fs')
const m = require('mithril')
/* eslint-enable no-unused-vars */

module.exports = class AppAudio {
  constructor () {
    this.id = 'AppAudio'
    window.$eu.music = new Map()
    window.$eu.sfx = new Map()

    window.$eu.music.getRandom = () => {
      const length = window.$eu.music.size
      const music = Array.from(window.$eu.music)
      return music[Math.floor(Math.random() * length)][1]
    }

    window.$eu.music.stop = () => {
      window.$eu.music.forEach(music => {
        music.pause()
      })
    }

    this.musicPath = process.env.DEVELOPMENT ? './asset/music' : `${process.resourcesPath}/app.asar/asset/music/`
    this.sfxPath = process.env.DEVELOPMENT ? './asset/sfx' : `${process.resourcesPath}/app.asar/asset/sfx/`

    const musicFiles = fs.readdirSync(this.musicPath)
    const sfxFiles = fs.readdirSync(this.sfxPath)

    musicFiles.map(file => {
      const music = new window.Audio(`${this.musicPath}/${file}`)
      music.volume = 0.1
      window.$eu.music.set(file.split('.')[0], music)
    })

    sfxFiles.map(file => {
      const sfx = new window.Audio(`${this.sfxPath}/${file}`)
      sfx.volume = 0.1
      window.$eu.sfx.set(file.split('.')[0], sfx)
    })

    window.$eu.music.getRandom()
    window.$eu.music.getRandom()
    window.$eu.music.getRandom()
    window.$eu.music.getRandom()
  }

  view () {}
}
