const app = require('supertest')(require('../../server/app'));
const db = require('../../server/db/db');
const { User } = require('../../server/db/models');

describe('user api tests', () => {
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
    return Promise.all([User.truncate({ cascade: true })]);
  });

  describe('blah lbah', () => {
    test('User can login', async () => {
      await newUser.save();

      const creds = {
        username: 'ubern00bi3',
        password: 'La1La1',
      };

      return app.post('/api/auth/login').send(creds).expect(200);
    });
  });
});
