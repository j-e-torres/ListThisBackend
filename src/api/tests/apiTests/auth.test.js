const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { db } = require('../../../config/sequelize');
const { User } = require('../../models');
const { populateTestDB, cleanDB } = require('../utils');

describe('Authentication API', () => {
  let user;
  let admin;
  let adminAccessToken;
  let userAccessToken;
  let supermanAdmin;
  let wondergirl;

  beforeEach(async () => {
    user = {
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
        .send(user)
        .expect(httpStatus.CREATED);

      expect(res.body.token).toHaveProperty('accessToken');
      expect(res.body.data.user.username).toBe(user.username);
    });

    // it('should report error when email already exists', () => {
    //   return request(app)
    //     .post('/v1/auth/register')
    //     .send(dbUser)
    //     .expect(httpStatus.CONFLICT)
    //     .then((res) => {
    //       const { field } = res.body.errors[0];
    //       const { location } = res.body.errors[0];
    //       const { messages } = res.body.errors[0];
    //       expect(field).to.be.equal('email');
    //       expect(location).to.be.equal('body');
    //       expect(messages).to.include('"email" already exists');
    //     });
    // });

    // it('should report error when the email provided is not valid', () => {
    //   user.email = 'this_is_not_an_email';
    //   return request(app)
    //     .post('/v1/auth/register')
    //     .send(user)
    //     .expect(httpStatus.BAD_REQUEST)
    //     .then((res) => {
    //       const { field } = res.body.errors[0];
    //       const { location } = res.body.errors[0];
    //       const { messages } = res.body.errors[0];
    //       expect(field).to.be.equal('email');
    //       expect(location).to.be.equal('body');
    //       expect(messages).to.include('"email" must be a valid email');
    //     });
    // });

    // it('should report error when email and password are not provided', () => {
    //   return request(app)
    //     .post('/v1/auth/register')
    //     .send({})
    //     .expect(httpStatus.BAD_REQUEST)
    //     .then((res) => {
    //       const { field } = res.body.errors[0];
    //       const { location } = res.body.errors[0];
    //       const { messages } = res.body.errors[0];
    //       expect(field).to.be.equal('email');
    //       expect(location).to.be.equal('body');
    //       expect(messages).to.include('"email" is required');
    //     });
    // });
  });
});
