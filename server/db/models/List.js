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

// instance methods
List.prototype.createNewTask = function (task) {
  return this.createTask(task).catch((e) => {
    throw e;
  });
};

module.exports = List;
