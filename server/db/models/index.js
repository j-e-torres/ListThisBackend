// const Group = require('./Group');
const List = require('./List');
const Task = require('./Task');
const User = require('./User');

User.belongsToMany(List, {
  through: 'userlist',
});
List.belongsToMany(User, {
  through: 'userlist',
});

List.hasMany(Task);
Task.belongsTo(List);

module.exports = {
  // Group,
  List,
  Task,
  User,
};
