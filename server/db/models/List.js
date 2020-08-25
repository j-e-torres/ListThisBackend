/* eslint-disable func-names */
const db = require('../db');

const { Sequelize } = db;
const Task = require('./Task');
const User = require('./User');

const { createdSeedInstances } = require('../../../tests/testHelperFunctions');

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
List.prototype.createNewTasks = function (tasks) {
  return createdSeedInstances(Task, tasks)
    .then((_tasks) => this.addTasks(_tasks))
    .then((list) => List.findByPk(list.id, {
        include: [{ model: Task }, { model: User }],
      }).then((_list) => _list))
    .catch((e) => {
      throw e;
    });
};

module.exports = List;
