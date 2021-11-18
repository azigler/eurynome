const { v4: uuidv4 } = require('uuid')

module.exports = {
  async handle ({ data, character }) {
    console.log(data)
    const sceneName = uuidv4().split('-')[0]
    // const sceneName = `${data.payload.world}__dicebox`
    const sceneExists = await this.server.M_database.fetchDoc({ db: 'scene', id: sceneName })

    switch (data.payload.action) {
      case 'roll': {
        const result = this.roll({ sides: data.payload.sides, amount: data.payload.amount })

        const name = data.payload.shared ? character.name : 'you'

        let log
        if (data.payload.sides > 2) {
          log = `${name} rolled ${data.payload.amount}d${data.payload.sides}: ${result}`
        } else {
          log = `${name} flipped a coin: ${result === 1 ? 'HEADS' : 'TAILS'}`
        }

        character.socket.emit('dice-log-event', {
          log
        })

        if (data.payload.shared) {
          character.server.M_database.updateDoc({
            db: 'scene',
            id: sceneName,
            payload: {
              log: [...sceneExists.log, log]
            }
          })

          sceneExists.characters.forEach(name => {
            character.server.M_character.getCharacterByName(name).socket.emit('dice-log-event', {
              log
            })
          })
        }
        break
      }

      case 'join': {
        if (data.payload.shared) {
          if (sceneExists.status === 404) {
            this.server.M_database.initDoc({
              db: 'scene',
              id: sceneName,
              payload: {
                characters: [character.name],
                log: []
              }
            })
          } else {
            const log = `${character.name} has joined the dicebox`

            character.server.M_database.updateDoc({
              db: 'scene',
              id: sceneName,
              payload: {
                characters: Array.from(new Set([...sceneExists.characters, character.name])),
                log: [...sceneExists.log, log]
              }
            })

            character.socket.emit('dice-log-event', { log: [...sceneExists.log, log] })

            sceneExists.characters.forEach(name => {
              character.server.M_character.getCharacterByName(name).socket.emit('dice-log-event', {
                log
              })
            })
          }
        }
        break
      }

      case 'leave': {
        if (data.payload.shared) {
          const log = `${character.name} has left the dicebox`

          character.server.M_database.updateDoc({
            db: 'scene',
            id: `${data.payload.world}__dicebox`,
            payload: {
              characters: sceneExists.characters.filter(char => char !== character.name),
              log: [...sceneExists.log, log]
            }
          })

          sceneExists.characters.forEach(name => {
            character.server.M_character.getCharacterByName(name).socket.emit('dice-log-event', {
              log
            })
          })
        }
      }
    }
  },

  roll ({ sides, amount }) {
    let total = 0

    for (let i = amount; i > 0; i--) {
      total += Math.ceil(Math.random() * sides)
    }

    return total
  }
}
