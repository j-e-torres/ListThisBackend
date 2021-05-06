const Sequelize = require('sequelize');
const { db } = require('../../config/sequelize');

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

Task.createTasks = async function createTasks({ tasks, listId }) {
  const newTasks = await Promise.all(
    tasks.map((task) => Task.create({ taskName: task.taskName, listId }))
  );

  return newTasks;
};

// instance methods
Task.prototype.completeTask = function completeTask() {
  return this.update({ completed: true });
};

module.exports = Task;
