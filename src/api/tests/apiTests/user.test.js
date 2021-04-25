const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { db } = require('../../../config/sequelize');
const { User } = require('../../models');
const { populateTestDB } = require('../utils');

describe('User api routes', () => {
  beforeAll(() => db.sync({ force: true }));

  let newUser;
  beforeEach(async () => {
    newUser = User.build({
      username: 'ubern00bi3',
      password: 'La1La1',
      displayName: 'fishy',
    });

    await populateTestDB();
  });

  // [adminAccessToken, userAccessToken] = tokens;
  // [firstUserId, secondUserId] = userIds;
  // dbUsers.branStark = await User.findById(firstUserId);
  // dbUsers.jonSnow = await User.findById(secondUserId);
  // dbUsers.branStark.password = password;
  // dbUsers.jonSnow.password = password;

  afterEach(() => Promise.all([User.truncate({ cascade: true })]));
});
