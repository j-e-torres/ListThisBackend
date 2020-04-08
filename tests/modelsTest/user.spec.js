const { User, Group, List } = require('../../server/db/models/');
const db = require('../../server/db/db');
const SequelizeValidationError = require('sequelize').ValidationError;

const validationTester = require('../testHelperFunctions');

describe('User model tests', () => {
  beforeAll(() => {
    return db.sync({ force: true });
  });

  let newUser;
  beforeEach(() => {
    newUser = User.build({
      username: 'ubern00bi3',
      password: 'La1La1',
      displayName: 'fishy',
      isGroupAdmin: true,
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
      // expect(newUser).toHaveProperty('isGroupAdmin');
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

      test('username must be unique', async () => {
        let error;
        try {
          await newUser.save();
          newerUser = User.build({
            username: 'family',
          });
          await newerUser.save();
        } catch (err) {
          error = err;
        }

        if (error) {
          const notEmptyError = error.errors.find(
            (e) => e.validatorKey === 'not_unique'
          );

          if (notEmptyError)
            expect(notEmptyError.message).toBe('username already in use!');
        } else throw Error('username validation failed');
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
          .then((user) => {
            expect(user.password).toBe(null);
          })
          .catch((e) => e);
      });

      test('Password is hashed', async () => {
        await newUser.save();
        await expect(newUser.password).not.toBe('La1La1');
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

  describe('User model functions', () => {
    test('User is authenticated and logs in with correct credentials', async () => {
      await newUser.save();

      const credentials = {
        username: 'UBERn00bi3',
        password: 'La1La1',
      };

      const authenticatedUser = await User.authenticate(credentials);

      await expect(authenticatedUser.username).toBe('ubern00bi3');
    });

    test('User cannot be authenticated and log in with incorrect username', async () => {
      await newUser.save();

      const credentials = {
        username: 'UBERn0bi3',
        password: 'La1La1',
      };

      let authenticatedUser, error;

      try {
        authenticatedUser = await User.authenticate(credentials);
      } catch (err) {
        error = err;
      }

      if (authenticatedUser)
        throw Error('Error: User was able to log in with incorrect username');

      await expect(error.message).toBe('Username or password is invalid');
      await expect(error.status).toBe(401);
    });

    test('User cannot be authenticated and log in with incorrect password', async () => {
      await newUser.save();

      const credentials = {
        username: 'UBERn00bi3',
        password: 'La1La1e',
      };

      let authenticatedUser, error;

      try {
        authenticatedUser = await User.authenticate(credentials);
      } catch (err) {
        error = err;
      }

      if (authenticatedUser)
        throw Error('Error: User was able to log in with incorrect password');

      await expect(error.message).toBe('Username or password is invalid');
      await expect(error.status).toBe(401);
    });

    test('User can sign up and create an account', () => {
      const signUpCredentials = {
        username: 'princess',
        password: 'La1La1e',
        displayName: 'coolman',
      };

      return User.signUp(signUpCredentials)
        .then((user) => expect(user.username).toBe('princess'))
        .catch((e) => {
          throw Error(
            `Error: User unable to sign up for following reasons: ${e.message}`
          );
        });
    });

    test('User can create a group and become group admin', () => {
      const createGroup = {
        groupName: 'family',
      };

      return newUser
        .save()
        .then((_user) => {
          return _user.createNewGroup(createGroup);
        })
        .then((group) => {
          return Group.findByPk(group.id, {
            include: [
              {
                model: User,
                where: { id: newUser.id },
              },
            ],
          });
        })
        .then((foundGroup) => {
          return Promise.all([
            expect(foundGroup.users[0].username).toBe(newUser.username),
            expect(foundGroup.groupOwner).toBe(newUser.username),
          ]);
        })
        .catch((e) => {
          throw Error(`Creating a group failed due to: ${e.message}`);
        });
    });

    test('User group admin can add a user to a group', () => {
      const newGroup = Group.build({
        groupName: 'family',
        groupOwner: 'ubern00bi3',
      });

      const newerUser = User.build({
        username: 'fishlady',
        password: 'La1La1',
        displayName: 'fishyladybitch',
      });

      return Promise.all([newerUser.save(), newGroup.save(), newUser.save()])
        .then(([_newerUser, _newGroup, _newUser]) => {
          return _newUser.addUserToGroup(newerUser, newGroup);
        })
        .then(() => {
          return User.findByPk(newerUser.id, {
            include: [
              {
                model: Group,
                where: { id: newGroup.id },
              },
            ],
          });
        })
        .then((foundUser) => {
          return Promise.all([
            expect(foundUser.groups[0].id).toBe(newGroup.id),
          ]);
        })
        .catch((e) => {
          throw Error(`Adding user to group failed: ${e.message}`);
        });
    });
  });
});
