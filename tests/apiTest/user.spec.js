const app = require('supertest')(require('../../server/app'));
const db = require('../../server/db/db');
const { User, Group } = require('../../server/db/models');

describe('user api tests', () => {
  beforeEach(() => {
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

  describe('Auth routes', () => {
    test('User can login', async () => {
      await newUser.save();

      const creds = {
        username: 'ubern00bi3',
        password: 'La1La1',
      };

      const response = await app
        .post('/api/auth/login')
        .send(creds)
        .expect(200);

      const _response = await app.get('/api/auth/login').set({
        authorization: response.body.token,
      });

      expect(_response.status).toBe(200);
      expect(_response.body.username).toBe(newUser.username);
    });

    test('User cannot login without proper token', async () => {
      const resp = await app.get('/api/auth/login').expect(401);
      expect(resp.error.text).toContain('Not logged in');
      expect(resp.error.status).toBe(401);
    });
  });

  describe('blah blah', () => {
    test('Can get all groups that belong to a user', async () => {
      await newUser.save();

      const groupOne = await Group.build({
        groupName: 'family',
        groupOwner: 'fisherman',
      });
      const groupTwo = await Group.build({
        groupName: 'company',
        groupOwner: 'fisherman',
      });

      await groupOne.save();
      await groupTwo.save();
      await newUser.setGroups([groupOne, groupTwo]);

      const response = await app
        .get(`/api/users/${newUser.id}/groups`)
        .expect(200);

      expect(response.body.length).toBe(2);
    });
  });
});
