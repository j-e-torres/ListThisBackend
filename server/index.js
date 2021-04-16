// const io = require('socket.io');
const app = require('./app');
const syncAndSeed = require('./db/seed');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

// const socketServer = io(server);

// require('./sockets')(socketServer);

// if (process.env.NODE_ENV === 'development') {
//   syncAndSeed().then(() => server);
// }

return syncAndSeed().then(() => server);
