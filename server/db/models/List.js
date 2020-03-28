const db = require('../db');
const { Sequelize } = db;

const List = db.define('list', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },

  listName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'List name required'
      },
      notEmpty: true,
      isAlphanumeric: {
        args: true,
        msg: 'List name must consist of letters and numbers'
      }
    }
  }
});

module.exports = List;
