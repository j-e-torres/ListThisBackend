/* eslint-disable no-unused-vars */
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { populateTestDB, cleanDB } = require('../utils');
const { Task } = require('../../models');

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

  describe('PATCH routes', () => {
    describe('PATCH /v1/tasks/:taskId/complete', () => {
      test('Should be able to `complete` task', async () => {
        const res = await request(app)
          .patch(`/v1/tasks/${oranges.id}/complete`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.OK);

        expect(res.body.data.task.completed).toBe(true);
      });

      test('Should report error when `taskId` is invalid', async () => {
        const res = await request(app)
          .patch(`/v1/tasks/''/complete`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.NOT_FOUND);

        expect(res.body.message).toBe('Task does not exist');
      });
    });
  });

  describe('DELETE routes', () => {
    describe('DELETE /v1/tasks/:taskId', () => {
      test('Should be able to delete task', async () => {
        await request(app)
          .delete(`/v1/tasks/${oranges.id}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.NO_CONTENT);

        const tasks = await Task.findAll();
        expect(tasks).toHaveLength(1);
      });
    });
  });
});
