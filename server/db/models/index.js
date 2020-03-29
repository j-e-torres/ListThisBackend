const Group = require('./Group');
const List = require('./List');
const Task = require('./Task');
const User = require('./User');

User.belongsToMany(Group, {
  through: 'usergroup'
});
Group.belongsToMany(User, {
  through: 'usergroup'
});

Group.hasMany(List);
List.belongsTo(Group);

List.hasMany(Task);
Task.belongsTo(List);

module.exports = {
  Group,
  List,
  Task,
  User
};
