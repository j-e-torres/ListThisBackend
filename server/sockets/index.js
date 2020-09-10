module.exports = (socketIO) => {
  socketIO.on('connection', (socket) => {
    socket.on('list-added-user', (user) => {
      socket.emit('list-added-user', user);
    });

    socket.on('new-lists', (lists) => {
      socket.emit('new-lists', lists);
    });
  });
};
