const PouchDB = require('pouchdb')
require('dotenv').config()

module.exports = class DatabaseManager extends Map {
  constructor ({ server }) {
    super()
    this.server = server
    this.namespace = 'eu_'

    this.server.on('start', () => {
      console.log('[#] Starting DatabaseManager...')

      const dbs = [
        'client',
        'character',
        'world',
        'scene'
      ]
      dbs.forEach(db => {
        this.set(db, this.loadDB(db))
      })

      this.server.DB_client = this.server.managers.get('DatabaseManager').get('client').remote
      this.server.DB_character = this.server.managers.get('DatabaseManager').get('character').remote
      this.server.DB_world = this.server.managers.get('DatabaseManager').get('world').remote
      this.server.DB_scene = this.server.managers.get('DatabaseManager').get('scene').remote
    })

    this.server.on('stop', () => {
      console.log('[#] Stopping DatabaseManager...')
      this.stopSyncing()
    })
  }

  loadDB (name) {
    const remote = new PouchDB(`http://${process.env.DB_UN}:${process.env.DB_PW}@localhost:5984/${this.namespace}${name}`)
    console.log(`=== Syncing ${name} database...`)

    const changes = remote.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', function (change) {
      if (change.doc._rev.split('-')[0] === '1') return
      console.log()
      console.log(`[~] Updated "${change.id}" document in ${name} database:`)
      console.log(change.doc)
      console.log()
    }).on('complete', function (info) {
      console.log(`=/= No longer syncing ${name} database!`)
    }).on('error', function (err) {
      console.log(err)
    })
    return {
      remote,
      changes
    }
  }

  initDoc ({ db, id, payload = {} }) {
    console.log()
    console.log(`[$] Initialized document "${id}" in ${db} database:`)
    console.log({ _id: id, payload })
    console.log()
    this.get(db).remote.put({ _id: id, ...payload })
      .catch(er => { return er })
  }

  fetchDoc ({ db, id }) {
    return this.get(db).remote
      .get(id)
      .then(data => { return data })
      .catch(er => { return er })
  }

  updateDoc ({ db, id, payload }) {
    return this.fetchDoc({ db, id })
      .then(data => {
        return this.get(db).remote.put({
          ...data,
          ...payload
        })
      })
      .catch(er => { return er })
  }

  stopSyncing () {
    this.forEach((db) => {
      db.changes.cancel()
    })
  }
}
