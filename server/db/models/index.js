const Group = require('./Group');
const List = require('./List');
const Task = require('./Task');
const User = require('./User');

// User.belongsToMany(List, { through: 'Junction' });
// List.belongsToMany(User, { through: 'Junction' });

User.belongsToMany(Group, { through: 'UserGroups' });
Group.belongsToMany(User, { through: 'UserGroups' });

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
