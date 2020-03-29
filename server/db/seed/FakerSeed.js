const faker = require('faker');

const UserSeed = [
  {
    username: 'superman200',
    displayName: 'el juan',
    password: '1L234s'
  },
  {
    username: 'wondergirl',
    displayName: 'wonder woman',
    password: '1L234s'
  }
];

const GroupSeed = (count = 5) => {
  const _groups = [];

  while (_groups.length < count) {
    _groups.push({
      groupName: faker.name.title()
    });
  }

  // console.log('_groups', _groups);
  return _groups;
};

const ListSeed = (count = 5) => {
  const _lists = [];

  while (_lists.length < count) {
    _lists.push({
      listName: faker.company.companyName()
    });
  }

  // console.log('_lists', _lists);
  return _lists;
};

const TaskSeed = (count = 12) => {
  const _tasks = [];

  while (_tasks.length < count) {
    _tasks.push({
      taskName: faker.commerce.productName()
    });
  }

  // console.log('_tasks', _tasks);
  return _tasks;
};

module.exports = {
  UserSeed,
  TaskSeed,
  GroupSeed,
  ListSeed
};
