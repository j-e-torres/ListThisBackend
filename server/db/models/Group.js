const db = require('../db');
const { Sequelize } = db;

const Group = db.define('group', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  groupName: {
    type: Sequelize.STRING,
    unique: {
      args: true,
      msg: 'Group name already in use!',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Group name required',
      },
      notEmpty: {
        args: true,
        msg: 'Group name cannot be empty',
      },
    },
  },
});

module.exports = Group;
