const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const { db } = require('../../config/sequelize');
const APIError = require('../utils/APIError');

const Task = db.define('task', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  taskName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Task name required',
      },
      notEmpty: {
        args: true,
        msg: 'Task name required',
      },
    },
  },

  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

// model methods
Task.createTasks = async function createTasks({ tasks, listId }) {
  const newTasks = await Promise.all(
    tasks.map((task) => Task.create({ taskName: task.taskName, listId }))
  );

  return newTasks;
};

Task.getTask = async function getTask(id) {
  try {
    const task = await Task.findByPk(id);
    return task;
  } catch (error) {
    throw new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'Task does not exist',
      isPublic: true,
    });
  }
};

// instance methods
Task.prototype.completeTask = function completeTask() {
  return this.update({ completed: true });
};

module.exports = Task;
