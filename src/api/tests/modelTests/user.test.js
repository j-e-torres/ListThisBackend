const { User } = require('../../models');
const { db } = require('../../../config/sequelize');

describe('User model test', () => {
  beforeAll(() => db.sync({ force: true }));

  let newUser;
  beforeEach(() => {
    newUser = User.build({
      username: 'ubern00bi3',
      password: 'La1La1',
      displayName: 'fishy',
    });
  });

  afterEach(() => Promise.all([User.truncate({ cascade: true })]));

  describe('Model attributes section', () => {
    test('Should have following attributes: `id`, `username`, `password`, `displayName`', () => {
      // console.log('bkqfjifjqejfqiefjqifjqeijf', User);

      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('username');
      expect(newUser).toHaveProperty('password');
      expect(newUser).toHaveProperty('displayName');
    });
  });
});
