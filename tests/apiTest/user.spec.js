const app = require('supertest')(require('../../server/app'));
const db = require('../../server/db/db');
const { User, Group } = require('../../server/db/models');
const jwt = require('jwt-simple');
const config = require('../../config');

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
    return Promise.all([
      User.truncate({ cascade: true }),
      Group.truncate({ cascade: true }),
    ]);
  });

  describe('Auth routes', () => {
    test('User can login', async () => {
      await newUser.save();

      const creds = {
        username: 'ubern00bi3',
        password: 'La1La1',
      };

      const response = await app.put('/api/auth/login').send(creds).expect(200);

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

  describe('User functionality', () => {
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

    test('Can Sign up and create a new account', async () => {
      const creds = {
        username: 'LOOKYLOO',
        password: 'La1La1',
        displayName: 'window man',
      };

      const response = await app.post('/api/users').send(creds).expect(200);

      const userId = await jwt.decode(
        response.body.token,
        config.get('JWT_ACCESS_TOKEN')
      ).id;

      const _user = await User.findByPk(userId);

      expect(_user.username).toBe('lookyloo');
    });

    test('User create new group route', async () => {
      await newUser.save();

      const newGroup = {
        groupName: 'family',
      };

      const response = await app
        .post(`/api/users/${newUser.id}/groups`)
        .send(newGroup)
        .expect(200);

      expect(response.body.groupName).toBe('family');
      expect(response.body.groupOwner).toBe(newUser.username);
    });

    test('Group owner can add a user to group', async () => {
      await newUser.save();

      const newGroup = await Group.build({
        groupName: 'family',
        groupOwner: 'ubern00bi3',
      });

      const otherUser = await User.build({
        username: 'superman',
        password: 'La1La1',
        displayName: 'superfreak',
      });

      await otherUser.save();
      await newGroup.save();

      const response = await app
        .post(`/api/users/${newUser.id}/groups/${newGroup.id}`)
        .send({ username: 'superman' })
        .expect(200);

      expect(response.body[0].userId).toBe(otherUser.id);
      expect(response.body[0].groupId).toBe(newGroup.id);
    });
  });
});
