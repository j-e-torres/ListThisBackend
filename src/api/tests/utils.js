// const bcrypt = require('bcryptjs');
const { List, User, Task } = require('../models');

exports.populateTestDB = async () => {
  // await db.sync({ force: true });

  await User.truncate({ cascade: true });
  await List.truncate({ cascade: true });
  await Task.truncate({ cascade: true });

  const password = 'La1La1';
  // const hashedPassword = await bcrypt.hash(password, 1);

  const dbUsers = {
    superman: {
      username: 'superman200',
      displayName: 'el juan',
      password,
      role: 'admin',
    },
    wondergirl: {
      username: 'wondergirl',
      displayName: 'wonder woman',
      password,
      role: 'user',
    },
  };

  const dbLists = {
    traderjoes: {
      listOwner: dbUsers.superman.username,
      listName: 'trader joes',
      listNotes: 'blah blah',
    },
    keyfood: {
      listOwner: dbUsers.wondergirl.username,
      listName: 'keyfood',
    },
  };

  const dbTasks = {
    apples: {
      taskName: 'apples',
    },
    oranges: {
      taskName: 'oranges',
    },
  };

  const superman = await User.create(dbUsers.superman);
  const wondergirl = await User.create(dbUsers.wondergirl);
  const traderjoes = await List.create(dbLists.traderjoes);
  const keyfood = await List.create(dbLists.keyfood);
  const apples = await Task.create(dbTasks.apples);
  const oranges = await Task.create(dbTasks.oranges);

  const adminAccessToken = (
    await User.authenticate({
      username: dbUsers.superman.username,
      password,
    })
  ).accessToken;

  const userAccessToken = (
    await User.authenticate({
      username: dbUsers.wondergirl.username,
      password,
    })
  ).accessToken;

  await superman.setLists(traderjoes);
  await wondergirl.setLists(keyfood);

  await traderjoes.setTasks(apples);
  await keyfood.setTasks(oranges);

  return {
    tokens: [adminAccessToken, userAccessToken],
    users: [superman, wondergirl],
    lists: [traderjoes, keyfood],
    tasks: [apples, oranges],
  };
};

exports.cleanDB = async () => {
  await User.truncate({ cascade: true });
  await List.truncate({ cascade: true });
  await Task.truncate({ cascade: true });
};

exports.closeDB = async () => {
  await User.sequelize.close();
  await List.sequelize.close();
  await Task.sequelize.close();
};
