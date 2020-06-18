const db = require('../db');
const { User, Task, List } = require('../models');
const { UserSeed, TaskSeed, ListSeed } = require('./FakerSeed');
const { createdSeedInstances } = require('../../../tests/testHelperFunctions');

const syncAndSeed = () => {
  return db
    .authenticate()
    .then(() => db.sync({ force: true }))
    .then(() => {
      return Promise.all([
        createdSeedInstances(User, UserSeed),
        createdSeedInstances(List, ListSeed()),
        createdSeedInstances(Task, TaskSeed()),
      ]);
    })
    .then(([users, lists, tasks]) => {
      return Promise.all([
        users.map((user) => user.setLists(lists)),
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
