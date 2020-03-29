const db = require('../db');
const { User, Task, Group, List } = require('../models');
const { UserSeed, TaskSeed, GroupSeed, ListSeed } = require('./FakerSeed');

const createdSeedInstances = (model, data) => {
  return Promise.all(data.map(instance => model.create(instance)));
};
//
const syncAndSeed = () => {
  return db
    .authenticate()
    .then(() => db.sync({ force: true }))
    .then(() => {
      return Promise.all([
        createdSeedInstances(User, UserSeed),
        createdSeedInstances(Group, GroupSeed()),
        createdSeedInstances(List, ListSeed()),
        createdSeedInstances(Task, TaskSeed())
      ]);
    })
    .then(([users, groups, lists, tasks]) => {
      return Promise.all([
        users.map(user => user.setGroups(groups))
        // console.log(users)
      ]);
    })
    .catch(err => console.error(err));
};

module.exports = syncAndSeed;
