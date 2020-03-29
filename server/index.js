const app = require('./app');
const PORT = process.env.PORT || 5000;
const syncAndSeed = require('./db/seed');

syncAndSeed().then(() =>
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
);
