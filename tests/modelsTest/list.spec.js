const { List } = require('../../server/db/models/');
const db = require('../../server/db/db');
const SequelizeValidationError = require('sequelize').ValidationError;

const validationTester = require('../testHelperFunctions');

describe('List model tests', () => {
  beforeAll(() => {
    return db.sync({ force: true });
  });

  let newList;
  beforeEach(() => {
    newList = List.build({
      listName: 'trader joes',
    });
  });

  /**
   *  empty the tables after each spec
   */

  afterEach(() => {
    return Promise.all([List.truncate({ cascade: true })]);
  });

  describe('attributes definition', () => {
    test('Includes `id`, `listName` fields', () => {
      expect(newList).toHaveProperty('id');
      expect(newList).toHaveProperty('listName');
    });
  });

  describe('Specific properties', () => {
    describe('List Name property', () => {
      test('listname cannot be null', async () => {
        await validationTester(
          newList,
          'listName',
          null,
          'listName notNull',
          'is_null',
          'List name required'
        );
      });

      test('listName cannot be empty', async () => {
        await validationTester(
          newList,
          'listName',
          '',
          'listName notEmpty',
          'notEmpty',
          'List name cannot be empty'
        );
      });

      test('listName must be unique', async () => {
        let error;
        try {
          await newList.save();
          newerList = List.build({
            listName: 'trader joes',
          });
          await newerList.save();
        } catch (err) {
          error = err;
        }

        if (error) {
          const notEmptyError = error.errors.find(
            (e) => e.validatorKey === 'not_unique'
          );

          if (notEmptyError)
            expect(notEmptyError.message).toBe('List name already in use!');
        } else throw Error('listName validation failed');
      });
    });
  });
});
