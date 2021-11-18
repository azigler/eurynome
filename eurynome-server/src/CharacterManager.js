const Character = require('./Character')

module.exports = class CharacterManager extends Map {
  constructor ({ server }) {
    super()
    this.server = server
    this.activeNames = new Set()

    this.server.on('start', () => {
      console.log('[#] Starting CharacterManager...')
      this.getActiveNames()
    })

    this.server.on('stop', () => {
      console.log('[#] Stopping CharacterManager...')
      this.forEach(character => this.removeCharacter(character))
    })
  }

  getActiveNames () {
    this.server.DB_character.allDocs({
      include_docs: true
    })
      .then(result => {
        result.rows.map(char => {
          if (char.doc.name === undefined || char.doc.name === '' || char.doc.active === false) return
          this.activeNames.add(char.doc.name)
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  initializeCharacter ({ name, uuid, client, world }) {
    const worldObject = this.server.M_world.get(world)

    if (!uuid) {
      if (this.activeNames.has(name)) {
        return client.socket.emit('character-name-taken')
      }

      console.log('[*] Initializing new character...')
    }

    const character = new Character({ server: this.server, name, client, world: worldObject, uuid })

    const characterInfo = {
      name: character.name,
      world,
      uuid: character.uuid
    }

    if (!uuid) {
      character.socket.emit('new-character-initialized', characterInfo)
      this.server.M_database.initDoc({
        db: 'character',
        id: character.uuid,
        payload: {
          name,
          world,
          client: client.uuid
        }
      })

      client.characters.push(characterInfo)

      client.emitAvailable()

      this.activeNames.add(name)

      client.update()
    }
    this.addCharacter(character)
  }

  addCharacter (character) {
    this.set(character.uuid, character)

    console.log(`[+] Added character to CharacterManager: ${character.name} @ ${character.world.name}`)

    const characters = this.getCharacters()

    this.forEach(character => {
      character.socket.emit('connected-characters', { characters })
    })
  }

  removeCharacter (character) {
    character.socket.removeAllListeners('handle-world-event')

    if (character.client.currentCharacter && character.client.currentCharacter.name === character.name) {
      character.client.currentCharacter = undefined
    }

    this.delete(character.uuid)

    console.log(`[-] Removed character from CharacterManager: ${character.name}`)

    const characters = this.getCharacters()

    this.forEach(character => {
      character.socket.emit('connected-characters', { characters })
    })
  }

  getCharacters () {
    const characters = []

    this.forEach(character => characters.push({ name: character.name, world: character.world.name }))

    return characters
  }

  getCharacterByName (name) {
    let char1 = {}

    this.forEach(char => {
      if (char.name === name) {
        char1 = char
      }
    })

    return char1
  }
}
