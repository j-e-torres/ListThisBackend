const db = require('../db');
const { Sequelize } = db;

const Task = db.define('task', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  taskName: {
    type: Sequelize.STRING,
    unique: {
      args: true,
      msg: 'Task name already in use!',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Task name required',
      },
      notEmpty: {
        args: true,
        msg: 'Task name cannot be empty',
      },
    },
  },
});

module.exports = Task;
