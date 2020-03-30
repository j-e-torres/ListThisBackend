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
      // const savedUser = newUser.save();

      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('username');
      expect(newUser).toHaveProperty('password');
      expect(newUser).toHaveProperty('displayName');
      expect(newUser).toHaveProperty('isGroupAdmin');
    });

    test('Requires `username`, `displayName`, `password` ', () => {
      newUser.username = null;
      newUser.displayName = null;
      newUser.password = null;

      newUser
        .validate()
        .then(res => {
          if (res)
            throw new SequelizeValidationError(
              'Validation should fail when fields are null, double check your model validation'
            );
        })
        .catch(e => {
          // console.log(e);
          expect(e).toBeInstanceOf(SequelizeValidationError);
        });
    });

    test('fields cannot be empty: `username`, `displayName`, `password`', () => {
      newUser.username = '';
      newUser.displayName = '';
      newUser.password = '';

      newUser
        .validate()
        .then(res => {
          if (res)
            throw new SequelizeValidationError(
              'Validation should fail when fields are null, double check your model validation'
            );
        })
        .catch(e => {
          // console.log(e);
          expect(e).toBeInstanceOf(SequelizeValidationError);
        });
    });
  });

  describe('Specific properties', () => {
    test('Username must only consist of letters or numbers', () => {
      newUser.username = '_ubernoobie';

      newUser
        .validate()
        .then(res => {
          if (res)
            throw new SequelizeValidationError(
              'Failed to enforce letters or numbers'
            );
        })
        .catch(e => {
          expect(e).toBeInstanceOf(SequelizeValidationError);
          expect(e.message).toContain(
            'Validation error: Username must consist of letters or numbers'
          );
        });
    });

    test('Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number', async () => {
      newUser.password = '123i';

      let result, error;
      try {
        result = await newUser.validate();
      } catch (err) {
        error = err;
      }

      if (result) throw Error('Failed to enforce password requirements');

      expect(error).toBeInstanceOf(SequelizeValidationError);
      expect(error.message).toContain(
        'Validation error: Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.'
      );
    });
  });
});
