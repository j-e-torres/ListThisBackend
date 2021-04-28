const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { db } = require('../../../config/sequelize');
const { User } = require('../../models');
const { populateTestDB, cleanDB } = require('../utils');

describe('User API routes', () => {
  const dbUsers = {};
  const password = '123456';
  let user;
  let admin;
  let adminAccessToken;
  let userAccessToken;
  let supermanAdmin;
  let wondergirl;
  let traderjoes;
  let keyfood;
  let apples;
  let oranges;

  // let newUser;

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
        const resp = await request(app)
          .get('/v1/users')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK);

        const { status, results, data } = resp.body;

        const firstUser = data.users.find((u) => u.username === 'superman200');
        const secondUser = data.users.find((u) => u.username === 'wondergirl');

        expect(status).toBe(httpStatus.OK);
        expect(results).toBe(2);
        expect(firstUser.username).toBe('superman200');
        expect(secondUser.username).toBe('wondergirl');
      });

      test('Should give error for non admin', async () => {
        const resp = await request(app)
          .get('/v1/users')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.FORBIDDEN);

        expect(resp.body.code).toBe(403);
        expect(resp.body.message).toBe('You do not have permission to do this');
      });
    });
  });
});
