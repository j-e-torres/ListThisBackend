const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { populateTestDB, cleanDB } = require('../utils');

describe('Task API routes', () => {
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
    newTasks = [
      {
        taskName: 'blah',
      },
      {
        taskName: 'yo',
      },
    ];
    const { tokens, users, lists, tasks } = await populateTestDB();

    [adminAccessToken, userAccessToken] = tokens;
    [supermanAdmin, wondergirl] = users;
    [traderjoes, keyfood] = lists;
    [apples, oranges] = tasks;
  });

  afterEach(async () => {
    await cleanDB();
  });

  describe('POST routes', () => {
    describe('POST /v1/tasks', () => {
      test('Should be able to create tasks when request is ok', async () => {
        const req = {
          listId: traderjoes.id,
          tasks: newTasks,
        };

        const res = await request(app)
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.CREATED);

        const { data } = res.body;

        expect(data.tasks).toHaveLength(2);
      });

      test('Should give error when `tasks` is not an array or an empty array', async () => {
        const req = {
          listId: traderjoes.id,
          tasks: [],
        };
        const res = await request(app)
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.BAD_REQUEST);

        expect(res.body.message).toBe('Tasks sent are invalid format');
      });

      test('Should give error when `tasks` are missing `taskNames`', async () => {
        const req = {
          listId: traderjoes.id,
          tasks: [''],
        };
        const res = await request(app)
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.BAD_REQUEST);

        expect(res.body.errors[0].message).toBe('Task name required');
      });
    });
  });
});
