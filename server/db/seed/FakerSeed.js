const faker = require('faker');

const UserSeed = [
  {
    username: 'superman200',
    displayName: 'el juan',
    password: '1L234s',
  },
  {
    username: 'wondergirl',
    displayName: 'wonder woman',
    password: '1L234s',
  },
];

// const GroupSeed = (count = 2) => {
//   const _groups = [];

//   while (_groups.length < count) {
//     _groups.push({
//       groupName: faker.name.title()
//     });
//   }

//   // console.log('_groups', _groups);
//   return _groups;
// };

const ListSeed = (count = 4) => {
  const _lists = [];

  while (_lists.length < count) {
    _lists.push({
      listName: faker.company.companyName(),
    });
  }
  return _lists;
};

const TaskSeed = (count = 12) => {
  const _tasks = [];

  while (_tasks.length < count) {
    _tasks.push({
      taskName: faker.commerce.productName(),
    });
  }
  return _tasks;
};

module.exports = {
  UserSeed,
  TaskSeed,
  ListSeed,
};
