const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { db } = require('../../../config/sequelize');
const { User } = require('../../models');

describe('User api routes', () => {
  beforeAll(() => db.sync({ force: true }));

  let newUser;
  beforeEach(() => {
    newUser = User.build({
      username: 'ubern00bi3',
      password: 'La1La1',
      displayName: 'fishy',
    });
  });

  afterEach(() => Promise.all([User.truncate({ cascade: true })]));
});
