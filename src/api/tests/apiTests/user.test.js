const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { db } = require('../../../config/sequelize');
const { User } = require('../../models');
const { populateTestDB, cleanDB } = require('../utils');

describe('User API routes', () => {
  // beforeAll(() => db.sync({ force: true }));

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
    // newUser = User.build({
    //   username: 'ubern00bi3',
    //   password: 'La1La1',
    //   displayName: 'fishy',
    // });

    jest.setTimeout(15000);

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
        let resp;
        try {
          resp = await request(app)
            .get('/v1/users')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);
        } catch (error) {
          console.log('222222', error);
          console.error(error);
        }

        expect(resp).toHaveLength(2);

        // .then(async (res) => {
        // before comparing it is necessary to convert String to Date
        // res.body[0].createdAt = new Date(res.body[0].createdAt);
        // res.body[1].createdAt = new Date(res.body[1].createdAt);

        // const includesBranStark = !!find(
        //   res.body,
        //   ({ email }) => bran.email === email
        // );
        // const includesjonSnow = !!find(
        //   res.body,
        //   ({ email }) => john.email === email
        // );

        // expect(res.body).to.be.an('array');
        // expect(res.body).to.have.lengthOf(2);
        // expect(includesBranStark).to.be.true;
        // expect(includesjonSnow).to.be.true;
        // });
      });
    });
  });
});
