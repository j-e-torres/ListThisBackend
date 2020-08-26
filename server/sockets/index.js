module.exports = (socketIO) => {
  socketIO.on('connection', (socket) => {
    console.log('socket connected');
    socket.emit('errrar');

    socket.on('new-list', (lists) => {
      socket.emit('new-lists', lists);
    });
  });
};
