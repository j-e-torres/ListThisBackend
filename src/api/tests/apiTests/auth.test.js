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
    it('should register a new user when request is ok', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(res.body.token).toHaveProperty('accessToken');
      expect(res.body.data.user.username).toBe(newUser.username);
    });

    it('should report error when `username` already exists', async () => {
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

    it('should report error when `username`, `password`, and `displayName` are not provided', async () => {
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

    it('should report error when `username` is not alphanumeric', async () => {
      newUser.username = '1122_eee';

      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.errors[0].message).toBe(
        'Username must consist of letters or numbers'
      );
    });
  });
});
