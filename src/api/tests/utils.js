const bcrypt = require('bcryptjs');
const { List, User, Task } = require('../models');

exports.populateTestDB = async () => {
  // await db.sync({ force: true });

  await User.truncate({ cascade: true });
  await List.truncate({ cascade: true });
  await Task.truncate({ cascade: true });

  const password = 'La1La1';
  const hashedPassword = await bcrypt.hash(password, 1);

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

  const superman = User.build(dbUsers.superman);
  const wondergirl = User.build(dbUsers.wondergirl);
  const traderjoes = List.build(dbLists.traderjoes);
  const keyfood = List.build(dbLists.keyfood);
  const apples = Task.build(dbTasks.apples);
  const oranges = Task.build(dbTasks.oranges);

  await superman.save();
  await wondergirl.save();
  await traderjoes.save();
  await keyfood.save();
  await apples.save();
  await oranges.save();

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

  // await superman.setLists(traderjoes);
  // await wondergirl.setLists(keyfood);

  // await traderjoes.setTasks(apples);
  // await keyfood.setTasks(oranges);

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
