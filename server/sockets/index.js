module.exports = socketIO => {
  socketIO.on('connection', socket => {
    socket.on('new-list', list => {
      socket.broadcast.emit('new-list', list)
    })
  })
}
