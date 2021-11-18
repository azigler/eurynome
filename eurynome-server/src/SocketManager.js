module.exports = class SocketManager extends require('socket.io') {
  constructor ({ server, port = 6177 }) {
    super()
    this.server = server

    this.server.on('start', () => {
      console.log('[#] Starting SocketManager...')
      this.listen(port)
    })

    this.server.on('stop', () => {
      console.log('[#] Stopping SocketManager...')
      if (this.engine.clientsCount > 0) console.log(`=/= Closing ${this.engine.clientsCount} connection${this.engine.clientsCount > 1 ? 's' : ''}`)
      this.close()
    })

    this.on('connection', (socket) => {
      console.log(`[o] A socket from ${socket.handshake.address} connected`)

      socket.emit('eurynome-handshake')
      console.log(`[o] Attempting handshake with a socket from ${socket.handshake.address}`)

      socket.on('eurynome-handshake', async (uuid) => {
        if (this.server.M_client.get(uuid)) {
          console.log(`[o] Closing first socket because client was already connected: ${uuid}`)
          this.server.M_client.get(uuid).socket.disconnect()
          socket.emit('duplicate-socket')
        }

        const clientExists = await this.server.M_database.fetchDoc({ db: 'client', id: uuid })

        if (clientExists.status !== 404) {
          console.log(`[o] Handshake recognized! A socket from ${socket.handshake.address} is client ${clientExists._id}`)
          socket.emit('handshake-recognized', { uuid })

          return this.server.M_client.initializeClient({ socket, uuid })
        } else {
          console.log(`[o] A socket from ${socket.handshake.address} is unrecognized`)
          socket.disconnect()
        }
      })

      socket.on('initialize-new-client', () => this.server.M_client.initializeClient({ socket }))

      socket.on('disconnect', (reason) => {
        if (reason) {
          console.log(`[o] A socket from ${socket.handshake.address} disconnected due to ${reason}`)
        } else {
          console.log(`[o] A socket from ${socket.handshake.address} disconnected`)
        }
      })
    })
  }
}
