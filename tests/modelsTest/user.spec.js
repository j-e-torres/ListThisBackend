const { User, List, Task } = require('../../server/db/models/');
const db = require('../../server/db/db');
const jwt = require('jwt-simple');
const config = require('../../config');

const { validationTester } = require('../testHelperFunctions');

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
    });
  });

  afterEach(() => {
    return Promise.all([
      User.truncate({ cascade: true }),
      List.truncate({ cascade: true }),
    ]);
  });

  describe('attributes definition', () => {
    test('Includes `id`, `username`, `password`, `displayName` fields', () => {
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('username');
      expect(newUser).toHaveProperty('password');
      expect(newUser).toHaveProperty('displayName');
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

      await expect(authenticatedUser).toBe(
        jwt.encode({ id: newUser.id }, config.get('JWT_ACCESS_TOKEN'))
      );
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
        .then((token) => {
          return User.exchangeTokenForUser(token);
        })
        .then((user) => expect(user.username).toBe('princess'))
        .catch((e) => {
          throw Error(
            `Error: User unable to sign up for following reasons: ${e.message}`
          );
        });
    });

    test('User can create a list and become list owner', () => {
      const list = {
        listName: 'family',
        tasks: [
          { taskName: 'punch face' },
          { taskName: 'college fund' },
          { taskName: 'give hugs' },
        ],
      };

      return newUser
        .save()
        .then((_user) => {
          return _user.createNewList(list);
        })
        .then((list) => {
          return List.findByPk(list.id, {
            include: [
              {
                model: User,
                where: { id: newUser.id },
              },
              {
                model: Task,
              },
            ],
          });
        })
        .then((foundList) => {
          return Promise.all([
            expect(foundList.users[0].username).toBe(newUser.username),
            expect(foundList.listOwner).toBe(newUser.username),
            expect(foundList.tasks.length).toBe(3),
          ]);
        })
        .catch((e) => {
          throw Error(`Creating a list failed due to: ${e.message}`);
        });
    });

    test('listOwner can add a user to a list', () => {
      const newList = List.build({
        listName: 'family',
        listOwner: 'ubern00bi3',
      });

      const newerUser = User.build({
        username: 'fishlady',
        password: 'La1La1',
        displayName: 'fishyladybitch',
      });

      return Promise.all([newerUser.save(), newList.save(), newUser.save()])
        .then(([_newerUser, _newList, _newUser]) => {
          return _newUser.addUserToList(newerUser, newList);
        })
        .then((userlist) => {
          return User.findByPk(userlist.userId, {
            include: [
              {
                model: List,
                include: [{ model: User }, { model: Task }],
              },
            ],
          });
        })
        .then((_user) => {
          const findAddedUser = _user.lists[0].users.find(
            (u) => u.id === _user.id
          );

          expect(findAddedUser.id).toBe(newerUser.id);
        })
        .catch((e) => {
          throw Error(`Adding user to list failed: ${e.message}`);
        });
    });
  });
});
