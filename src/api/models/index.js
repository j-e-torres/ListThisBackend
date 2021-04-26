const User = require('./User.model');
const List = require('./List.model');
const Task = require('./Task.model');

User.belongsToMany(List, {
  through: 'userlist',
});
List.belongsToMany(User, {
  through: 'userlist',
});

List.hasMany(Task);
Task.belongsTo(List);

module.exports = {
  User,
  List,
  Task,
};
