const { Sequelize } = require('sequelize');
const { postgres } = require('./vars');

const db = new Sequelize(postgres.uri, {
  logging: false,
  dialect: 'postgres',
});

const connect = () =>
  db
    .authenticate()
    .then(async () => {
      console.log('Sequelize Postgres connected');
      await db.sync();
    })
    .catch((err) => {
      console.log('1111111111 Sequelize connect error', err);
      // db.close();
    });

module.exports = {
  connect,
  db,
};
