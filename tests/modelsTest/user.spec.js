const User = require('../../server/db/models/User');
const db = require('../../server/db/db');
const SequelizeValidationError = require('sequelize').ValidationError;

const validationTester = require('../testHelperFunctions');

describe('User model tests', () => {
  beforeEach(() => {
    return db.sync({ force: true });
  });

  let newUser;
  beforeEach(() => {
    newUser = User.build({
      username: 'ubern00bi3',
      password: 'La1La1',
      displayName: 'fishy'
    });
  });

  afterEach(() => {
    return Promise.all([User.truncate({ cascade: true })]);
  });

  describe('attributes definition', () => {
    test('Includes `id`, `username`, `password`, `displayName`, and `isGroupAdmin` fields', () => {
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('username');
      expect(newUser).toHaveProperty('password');
      expect(newUser).toHaveProperty('displayName');
      expect(newUser).toHaveProperty('isGroupAdmin');
    });
  });

  describe('Specific properties', () => {
    describe('Username property', () => {
      test('username cannot be null', async () => {
        await validationTester(
          newUser,
          'username',
          null,
          'username notNull',
          'is_null',
          'Username required'
        );
      });

      test('username cannot be empty', async () => {
        await validationTester(
          newUser,
          'username',
          '',
          'username notEmpty',
          'notEmpty',
          'Username cannot be empty'
        );
      });

      test('Username must only consist of letters or numbers', async () => {
        await validationTester(
          newUser,
          'username',
          '_ubernoobie',
          'username isAlphanumeric',
          'isAlphanumeric',
          'Username must consist of letters or numbers.'
        );
      });
    });

    describe('Password property', () => {
      test('password cannot be null', async () => {
        await validationTester(
          newUser,
          'password',
          null,
          'username notNull',
          'is_null',
          'Password required'
        );
      });

      test('password cannot be empty', async () => {
        await validationTester(
          newUser,
          'password',
          '',
          'password notEmpty',
          'notEmpty',
          'Password cannot be empty'
        );
      });

      test('Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number', async () => {
        await validationTester(
          newUser,
          'password',
          '1Leei',
          'password `is`',
          'is',
          'Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.'
        );
      });

      test('Password is not sent in a get request', () => {
        User.findOne()
          .then(user => {
            expect(user.password).toBe(null);
          })
          .catch(e => e);
      });
    });

    describe('displayName Property', () => {
      test('password cannot be null', async () => {
        await validationTester(
          newUser,
          'displayName',
          null,
          'displayName notNull',
          'is_null',
          'Display name required'
        );
      });

      test('displayName cannot be empty', async () => {
        await validationTester(
          newUser,
          'displayName',
          '',
          'displayName notEmpty',
          'notEmpty',
          'Display name cannot be empty'
        );
      });
    });
  });
});
