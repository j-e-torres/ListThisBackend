const Sequelize = require('sequelize');
const { db } = require('../../config/sequelize');

const List = db.define('list', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  listOwner: {
    type: Sequelize.STRING,
  },

  listName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'List name required',
      },
      notEmpty: {
        args: true,
        msg: 'List name required',
      },
    },
  },

  listNotes: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '',
    validate: {
      notNull: {
        msg: 'invalid value for notes',
      },
    },
  },
});

module.exports = List;
