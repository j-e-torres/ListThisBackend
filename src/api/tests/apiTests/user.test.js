/* eslint-disable no-unused-vars */
// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { populateTestDB, cleanDB } = require('../utils');

describe('User API routes', () => {
  // beforeAll(async () => {
  //   await cleanDB();
  // });

  let adminAccessToken;
  let userAccessToken;
  let supermanAdmin;
  let wondergirl;
  let traderjoes;
  let keyfood;
  let apples;
  let oranges;

  beforeEach(async () => {
    const { tokens, users, lists, tasks } = await populateTestDB();

    [adminAccessToken, userAccessToken] = tokens;
    [supermanAdmin, wondergirl] = users;
    [traderjoes, keyfood] = lists;
    [apples, oranges] = tasks;
  });

  afterEach(async () => {
    await cleanDB();
  });

  describe('GET routes', () => {
    describe('GET /v1/users', () => {
      test('Should get all users for admin', async () => {
        const res = await request(app)
          .get('/v1/users')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK);

        const { status, results, data } = res.body;

        const firstUser = data.users.find((u) => u.username === 'superman200');
        const secondUser = data.users.find((u) => u.username === 'wondergirl');

        expect(status).toBe(httpStatus.OK);
        expect(results).toBe(2);
        expect(firstUser.username).toBe('superman200');
        expect(secondUser.username).toBe('wondergirl');
      });

      test('Should give error for non admin', async () => {
        const res = await request(app)
          .get('/v1/users')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.FORBIDDEN);

        expect(res.body.status).toBe(403);
        expect(res.body.message).toBe('You do not have permission to do this');
      });
    });

    describe('GET /v1/users/:userId/lists', () => {
      test('Should be able to get `lists` that belong to `user` when request is ok', async () => {
        const res = await request(app)
          .get(`/v1/users/${wondergirl.id}/lists`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.OK);

        expect(res.body.data.lists).toHaveLength(1);
      });

      test('Should report error when `userId` is invalid', async () => {
        const res = await request(app)
          .get(`/v1/users/${1}/lists`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.NOT_FOUND);

        expect(res.body.message).toBe('User does not exist');
      });

      test('Should report error if invalid token', async () => {
        const res = await request(app)
          .get(`/v1/users/${wondergirl.id}/lists`)
          .set('Authorization', `Bearer ${1}`)
          .expect(httpStatus.UNAUTHORIZED);

        expect(res.body.message).toBe('Invalid token');
      });
    });
  });
});
