/* eslint-disable node/no-unpublished-require */
const jwt = require('jwt-simple');
const app = require('supertest')(require('../../server/app'));
const db = require('../../server/db/db');
const { User, List } = require('../../server/db/models');
const config = require('../../config');

describe('user api tests', () => {
  beforeAll(() => db.sync({ force: true }));

  let newUser;
  beforeEach(() => {
    newUser = User.build({
      username: 'ubern00bi3',
      password: 'La1La1',
      displayName: 'fishy',
    });
  });

  afterEach(() =>
    Promise.all([
      User.truncate({ cascade: true }),
      List.truncate({ cascade: true }),
    ])
  );

  describe('Auth routes', () => {
    test('User can login', async () => {
      await newUser.save();

      const creds = {
        username: 'ubern00bi3',
        password: 'La1La1',
      };

      const response = await app.put('/api/auth/login').send(creds).expect(200);

      const otherResponse = await app.get('/api/auth/login').set({
        authorization: response.body.token,
      });

      expect(otherResponse.status).toBe(200);
      expect(otherResponse.body.username).toBe(newUser.username);
    });

    test('User cannot login without proper token', async () => {
      const resp = await app.get('/api/auth/login').expect(401);
      expect(resp.error.text).toContain('Not logged in');
      expect(resp.error.status).toBe(401);
    });
  });

  describe('User functionality', () => {
    test('Can get all lists that belong to a user', async () => {
      await newUser.save();

      const listOne = await List.build({
        listName: 'family',
        listOwner: 'fisherman',
      });
      const listTwo = await List.build({
        listName: 'company',
        listOwner: 'fisherman',
      });

      await listOne.save();
      await listTwo.save();
      await newUser.setLists([listOne, listTwo]);

      const response = await app
        .get(`/api/users/${newUser.id}/lists`)
        .expect(200);

      expect(response.body).toHaveLength(2);
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

      const sameUser = await User.findByPk(userId);

      expect(sameUser.username).toBe('lookyloo');
    });

    test('User can create new list with array of tasks', async () => {
      await newUser.save();

      const newList = {
        listName: 'family',
        tasks: [
          { taskName: 'punch face' },
          { taskName: 'college fund' },
          { taskName: 'give hugs' },
        ],
      };

      const response = await app
        .post(`/api/users/${newUser.id}/lists`)
        .send(newList)
        .expect(200);

      expect(response.body.listName).toBe('family');
      expect(response.body.listOwner).toBe(newUser.username);
      expect(response.body.tasks).toHaveLength(3);
    });

    test('List owner can add a user to group', async () => {
      await newUser.save();

      const newList = await List.build({
        listName: 'family',
        listOwner: 'ubern00bi3',
      });

      const otherUser = await User.build({
        username: 'superman',
        password: 'La1La1',
        displayName: 'superfreak',
      });

      await otherUser.save();
      await newList.save();

      const response = await app
        .post(`/api/users/${newUser.id}/lists/${newList.id}`)
        .send({ username: 'superman' })
        .expect(200);

      expect(response.body.id).toBe(otherUser.id);
      expect(response.body.username).toBe(otherUser.username);
      // console.log(response.body);
      // expect(response.body.lists).toBe(true);
      // console.log(response.body.lists);
    });
  });
});
