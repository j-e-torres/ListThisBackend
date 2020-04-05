const db = require('../db');
const { Sequelize } = db;

const List = db.define('list', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  listName: {
    type: Sequelize.STRING,
    unique: {
      args: true,
      msg: 'List name already in use!',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'List name required',
      },
      notEmpty: {
        args: true,
        msg: 'List name cannot be empty',
      },
    },
  },
});

module.exports = List;
