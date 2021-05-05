const { List, User, Task } = require('./src/api/models');

afterAll(async () => {
  // await User.sequelize.close();
  // await List.sequelize.close();
  // await Task.sequelize.close();
});
