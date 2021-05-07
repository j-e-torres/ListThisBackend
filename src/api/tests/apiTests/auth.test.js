/* eslint-disable no-unused-vars */
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { db } = require('../../../config/sequelize');
const { User } = require('../../models');
const { populateTestDB, cleanDB } = require('../utils');

describe('Authentication API', () => {
  const password = 'La1La1';

  let newUser;
  let admin;
  let adminAccessToken;
  let userAccessToken;
  let supermanAdmin;
  let wondergirl;

  beforeEach(async () => {
    newUser = {
      username: 'ubern00bi3',
      password: 'La1La1',
      displayName: 'fishy',
    };

    const { tokens, users } = await populateTestDB();

    [adminAccessToken, userAccessToken] = tokens;
    [supermanAdmin, wondergirl] = users;
  });

  afterEach(async () => {
    await cleanDB();
  });

  describe('POST /v1/auth/register', () => {
    test('should register a new user when request is ok', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(res.body.token).toHaveProperty('accessToken');
      expect(res.body.data.user.username).toBe(newUser.username);
    });

    test('should report error when `username` already exists', async () => {
      const wonderCreds = {
        username: 'wondergirl',
        displayName: 'wonder woman',
        password,
      };

      const res = await request(app)
        .post('/v1/auth/register')
        .send(wonderCreds)
        .expect(httpStatus.CONFLICT);

      expect(res.body.errors[0].message).toBe('Username already in use!');
    });

    test('should report error when `username`, `password`, and `displayName` are not provided', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send({})
        .expect(httpStatus.BAD_REQUEST);

      const { errors } = res.body;
      const messages = errors.reduce((acc, e) => {
        acc.push(e.message);
        return acc;
      }, []);

      expect(messages.includes('Username required')).toBe(true);
      expect(messages.includes('Password required')).toBe(true);
      expect(messages.includes('Display name required')).toBe(true);
    });

    test('should report error when `username` is not alphanumeric', async () => {
      newUser.username = '1122_eee';

      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.errors[0].message).toBe(
        'Username must consist of letters or numbers'
      );
    });

    test('should report error when `password` is not at least 6 length, upper/lower case, and 1 number', async () => {
      newUser.password = '1Kldf';

      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.errors[0].message).toBe(
        'Password must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.'
      );
    });
  });

  describe('POST /v1/auth/login', () => {
    test('Should return `user` with `lists belonging to user` and `accessToken` when request is ok', async () => {
      const loginWonder = {
        username: 'wondergirl',
        password,
      };

      const res = await request(app)
        .post('/v1/auth/login')
        .send(loginWonder)
        .expect(httpStatus.OK);

      expect(res.body.token.accessToken).toBe(userAccessToken);
      expect(res.body.data.user.username).toBe(wondergirl.username);
      expect(res.body.data.user).toHaveProperty('lists');
    });

    test('Should report `Incorrect username or password` when `username` or `password` are missing', async () => {
      const res = await request(app)
        .post('/v1/auth/login')
        .send({})
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).toBe('Incorrect username or password');
    });
  });
});
