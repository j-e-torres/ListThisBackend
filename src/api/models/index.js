const User = require('./User.model');
const List = require('./List.model');
const Task = require('./Task.model');

User.belongsToMany(List, {
  through: 'userlist',
});
List.belongsToMany(User, {
  through: 'userlist',
});

List.hasMany(Task, {
  foreignKey: 'listId',
});
Task.belongsTo(List, {
  foreignKey: {
    name: 'listId',
    allowNull: false,
  },
});

module.exports = {
  User,
  List,
  Task,
};
