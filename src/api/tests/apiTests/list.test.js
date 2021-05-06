const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { List } = require('../../models');
const { populateTestDB, cleanDB } = require('../utils');

describe('List API routes', () => {
  let newList;
  let newTasks;
  let adminAccessToken;
  let userAccessToken;
  let supermanAdmin;
  let wondergirl;
  let traderjoes;
  let keyfood;
  let apples;
  let oranges;

  beforeEach(async () => {
    newList = {
      listName: 'trader',
      listNotes: 'blah',
    };

    newTasks = [{ taskName: 'x' }, { taskName: 'y' }, { taskName: 't' }];

    const { tokens, users, lists, tasks } = await populateTestDB();

    [adminAccessToken, userAccessToken] = tokens;
    [supermanAdmin, wondergirl] = users;
    [traderjoes, keyfood] = lists;
    [apples, oranges] = tasks;
  });

  afterEach(async () => {
    await cleanDB();
  });

  describe.skip('POST routes', () => {
    describe('POST /v1/lists', () => {
      test('Should be able to create a list with tasks when request is ok', async () => {
        newList.listOwner = wondergirl.username;

        const req = {
          list: newList,
          tasks: newTasks,
          userId: wondergirl.id,
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.CREATED);

        const {
          data: { list },
        } = res.body;

        expect(list.listName).toBe(newList.listName);
        expect(list).toHaveProperty('tasks');
        expect(list.tasks).toHaveLength(3);
      });

      test('Should report error when `listname` or `listowner` is missing', async () => {
        newList.listOwner = wondergirl.username;
        newList.listName = '';

        const req = {
          list: {},
          tasks: newTasks,
          userId: wondergirl.id,
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.BAD_REQUEST);

        expect(res.body.message).toBe('List name required');
      });

      test('Should report error when `tasks` is not an array or an empty array', async () => {
        newList.listOwner = wondergirl.username;

        const req = {
          list: newList,
          tasks: 'newTasks',
          userId: wondergirl.id,
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.BAD_REQUEST);

        expect(res.body.message).toBe('Tasks sent are invalid format');
      });

      test('Should report error when `userId` is not  valid', async () => {
        newList.listOwner = wondergirl.username;

        const req = {
          list: newList,
          tasks: newTasks,
          userId: '',
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.NOT_FOUND);

        expect(res.body.message).toBe('User does not exist');
      });

      test('Should report error when `tasks` do not have `taskName`', async () => {
        newList.listOwner = wondergirl.username;

        const req = {
          list: newList,
          tasks: [''],
          userId: wondergirl.id,
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.BAD_REQUEST);

        expect(res.body.errors[0].message).toBe('Task name required');
      });
    });
  });
});
