const Sequelize = require('sequelize');
const { postgres } = require('./vars');

const db = new Sequelize(postgres.uri, {
  logging: false,
  dialect: 'postgres',
});

const connect = () => {
  db.authenticate()
    .then(() => db.sync())
    .then(() => console.log('Sequelize Postgres connected '))
    .then(() => db.close())
    .catch((err) => {
      console.log(err);
      db.close();
    });
};

module.exports = {
  connect,
  db,
};
