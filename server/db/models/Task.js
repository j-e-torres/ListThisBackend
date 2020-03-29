const db = require('../db');
const { Sequelize } = db;

const Task = db.define('task', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },

  taskName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Task name required'
      },
      notEmpty: true
      // isAlphanumeric: {
      //   args: true,
      //   msg: 'Task name must consist of letters and numbers'
      // }
    }
  }
});

module.exports = Task;
