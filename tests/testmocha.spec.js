const User = require('../server/db/models/User');
// const syncAndSeed = require('../../server/db/seed');
const db = require('../server/db/db');
const SequelizeValidationError = require('sequelize').ValidationError;
const { expect } = require('chai');

describe('user model mocha chai test', () => {
  beforeEach(() => {
    return db.sync({ force: true });
  });

  let newUser;
  beforeEach(() => {
    newUser = User.build({
      username: 'ubern00bi3',
      password: 'La1La1',
      displayName: 'fishy'
    });
  });

  afterEach(() => {
    return Promise.all([User.truncate({ cascade: true })]);
  });

  describe('attrib def', () => {
    it('tests passowrd', done => {
      newUser.password = '1Lee222i';
      newUser
        .validate()
        .then(() => {
          const e = Error('failed to enforce');

          done(e);
        })
        .catch(err => {
          expect(err).to.be.instanceOf(SequelizeValidationError);
          expect(err.errors[0].validatorKey).to.equal('is');
        });
    });
  });
});
