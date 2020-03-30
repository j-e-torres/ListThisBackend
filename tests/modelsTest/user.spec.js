const User = require('../../server/db/models/User');
// const syncAndSeed = require('../../server/db/seed');
const db = require('../../server/db/db');
const SequelizeValidationError = require('sequelize').ValidationError;

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

    test('Requires `username`, `displayName`, `password` ', async () => {
      newUser.username = null;
      newUser.displayName = null;
      newUser.password = null;

      let result, error;
      try {
        result = await newUser.validate();
      } catch (err) {
        error = err;
      }

      if (result) throw Error('Failed to enforce notEmpty validation');

      expect(error).toBeInstanceOf(SequelizeValidationError);
      expect(error.message).toContain('notNull Violation');
    });

    test('fields cannot be empty: `username`, `displayName`, `password`', async () => {
      newUser.username = '';
      newUser.displayName = '';
      newUser.password = '';

      let result, error;
      try {
        result = await newUser.validate();
      } catch (err) {
        error = err;
      }

      if (result) throw Error('Failed to enforce notEmpty validation');

      // console.log('--------  ', error);
      expect(error).toBeInstanceOf(SequelizeValidationError);
      expect(error.message).toContain('Validation error');
      // for (const e of error.errors) {
      //   expect(e.validatorName).toBe('notEmpty');
      // }
    });
  });

  describe('Specific properties', () => {
    test('Username must only consist of letters or numbers', async () => {
      newUser.username = '_ubernoobie';

      let result, error;

      try {
        result = await newUser.validate();
      } catch (err) {
        error = err;
      }

      if (result) throw Error('Failed to enforce letters or numbers');

      expect(error).toBeInstanceOf(SequelizeValidationError);
      expect(error.message).toContain(
        'Validation error: Username must consist of letters or numbers.'
      );
    });

    test('Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number', done => {
      newUser.password = '1Leei';

      newUser
        .validate()
        .then(() => {
          const e = Error('failed to enforce');
          done(e);
        })
        .catch(err => {
          expect(err.errors[0].validatorKey).toBe('is');
          done();
        });

      // let result, error;
      // try {
      //   result = await newUser.validate();
      // } catch (err) {
      //   error = err;
      // }

      // if (result) throw Error('Failed to enforce password requirements');

      // await expect(error).toBeInstanceOf(SequelizeValidationError);
      // await expect(error.message).toContain(
      //   'Validation error: Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.'
      // );
    });
  });
});
