const db = require('../db');
const { Sequelize } = db;

const Group = db.define('group', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },

  groupName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Group name required'
      },
      notEmpty: true
      // isAlphanumeric: {
      //   args: true,
      //   msg: 'Group name must consist of letters and numbers'
      // }
    }
  }
});

module.exports = Group;
