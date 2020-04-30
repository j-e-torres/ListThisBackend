const db = require('../db');
const { User, Task, Group, List } = require('../models');
const { UserSeed, TaskSeed, GroupSeed, ListSeed } = require('./FakerSeed');

const createdSeedInstances = (model, data) => {
  return Promise.all(data.map((instance) => model.create(instance)));
};

const syncAndSeed = () => {
  return db
    .authenticate()
    .then(() => db.sync({ force: true }))
    .then(() => {
      return Promise.all([
        createdSeedInstances(User, UserSeed),
        createdSeedInstances(Group, GroupSeed()),
        createdSeedInstances(List, ListSeed()),
        createdSeedInstances(Task, TaskSeed()),
      ]);
    })
    .then(([users, groups, lists, tasks]) => {
      return Promise.all([
        users.map((user) => user.setGroups(groups)),
        groups[0].setLists(lists.slice(0, lists.length / 2)),
        groups[1].setLists(lists.slice(lists.length / 2, lists.length)),
        lists[0].setTasks(tasks.slice(0, 3)),
        lists[1].setTasks(tasks.slice(3, 6)),
        lists[2].setTasks(tasks.slice(6, 9)),
        lists[3].setTasks(tasks.slice(9, 12)),
      ]);
    })
    .then(() => console.log('Database seeded'))
    .catch((err) => console.error(err));
};

module.exports = syncAndSeed;
