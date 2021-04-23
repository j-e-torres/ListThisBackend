const bcryptjs = require('bcryptjs');
const { User } = require('../../models');
const { db } = require('../../../config/sequelize');

describe.skip('User model test', () => {
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

  describe('User attributes section', () => {
    test('Should have following attributes: `id`, `username`, `password`, `displayName`', () => {
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('username');
      expect(newUser).toHaveProperty('password');
      expect(newUser).toHaveProperty('displayName');
    });

    describe('Username property', () => {
      test('Should report `Username already in use!` when username is not unique', async () => {
        await newUser.save();

        const otherUser = User.build({
          username: 'ubern00bi3',
          password: 'La1La1',
          displayName: 'eqwmleq',
        });

        let errorResult;
        try {
          await otherUser.save();
        } catch (error) {
          [errorResult] = error.errors;
        }
        expect(errorResult.message).toBe('Username already in use!');
      });

      test('Should report `Username required` when username is null', async () => {
        newUser.username = null;

        let errorResult;
        try {
          await newUser.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }
        expect(errorResult.message).toBe('Username required');
      });

      test('Should report `Username required` when username is empty', async () => {
        newUser.username = '';

        let errorResult;
        try {
          await newUser.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }
        expect(errorResult.message).toBe('Username required');
      });

      test('Should report `Username must consist of letters or numbers` when username is not alphanumeric', async () => {
        newUser.username = '$$$';

        let errorResult;
        try {
          await newUser.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }
        expect(errorResult.message).toBe(
          'Username must consist of letters or numbers'
        );
      });
    });

    describe('Password property', () => {
      test('Should report `Password required` when password is null', async () => {
        newUser.password = null;

        let errorResult;

        try {
          await newUser.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }

        expect(errorResult.message).toBe('Password required');
      });

      test('Should report `Password required` when password is empty', async () => {
        newUser.password = '';

        let errorResult;

        try {
          await newUser.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }

        expect(errorResult.message).toBe('Password required');
      });

      test('Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.', async () => {
        newUser.password = 'aaa';

        let errorResult;

        try {
          await newUser.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }

        expect(errorResult.message).toBe(
          'Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.'
        );
      });

      test('Password should not be in a GET request', async () => {
        await newUser.save();

        const user = await User.findByPk(newUser.id);

        expect(user.password).toBe(undefined);
      });

      test('Password is hashed', async () => {
        await newUser.save();

        const passwordCompared = await bcryptjs.compare(
          'La1La1',
          newUser.password
        );
        expect(passwordCompared).toBe(true);
      });
    });

    describe('displayName property', () => {
      test('Should report `Display name required` when displayName is null', async () => {
        newUser.displayName = null;

        let errorResult;

        try {
          await newUser.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }

        expect(errorResult.message).toBe('Display name required');
      });

      test('Should report `Display name required` when displayName is empty', async () => {
        newUser.displayName = '';

        let errorResult;

        try {
          await newUser.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }

        expect(errorResult.message).toBe('Display name required');
      });
    });
  });
});
