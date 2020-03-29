const { User } = require('../../server/db/models');
const syncAndSeed = require('../../server/db/seed');
const sequelizeValidationError = require('sequelize').ValidationError;

describe('User model tests', () => {
  beforeEach(() => {
    return syncAndSeed();
  });

  let newUser;
  beforeEach(() => {
    newUser = User.build({
      username: 'ubern00bi3',
      password: 'La1La1',
      displayName: 'fishy'
    });
  });

  // afterEach(() => {
  //   return Promise.all([
  //     // Article.truncate({ cascade: true }),
  //     User.truncate({ cascade: true })
  //   ]);
  // });

  test('it is defined', () => {
    return expect(newUser).toBeDefined();
  });

  describe('attributes definition', () => {
    test('It has id, username, password, displayName, and isGroupAdmin fields', () => {
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('username');
      expect(newUser).toHaveProperty('password');
      expect(newUser).toHaveProperty('displayName');
      expect(newUser).toHaveProperty('isGroupAdmin');
    });
  });

  describe('username properties', () => {
    test('username is set to lowercase', () => {
      newUser.username = 'UBERn00bi3';

      expect(newUser.username).toBe('ubern00bi3');
    });

    test('Validates that it must be letters and numbers', () => {});
  });
});
