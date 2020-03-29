const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/listthisdb',
  { logging: false }
);

module.exports = db;
