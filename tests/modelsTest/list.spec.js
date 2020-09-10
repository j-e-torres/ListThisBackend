/* eslint-disable jest/expect-expect */
const { List } = require("../../server/db/models");
const db = require('../../server/db/db');

const { validationTester } = require("../testHelperFunctions");

describe('List model tests', () => {
  beforeAll(() => db.sync({ force: true }));

  let newList;
  beforeEach(() => {
    newList = List.build({
      listName: 'trader joes',
    });
  });

  /**
   *  empty the tables after each spec
   */

  afterEach(() => Promise.all([List.truncate({ cascade: true })]));

  describe('attributes definition', () => {
    test('Includes `id`, `listName` fields', () => {
      expect(newList).toHaveProperty('id');
      expect(newList).toHaveProperty('listName');
      expect(newList).toHaveProperty('listNotes');
      expect(newList).toHaveProperty('listOwner');
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
    });
  });

  describe('list model functions', () => {
    test('Can create and add an array of tasks to current list', () => {
      const tasks = [
        {
          taskName: 'oranges',
        },
        {
          taskName: 'fish',
        },
        {
          taskName: 'apple',
        },
      ];

      return newList
        .save()
        .then((_list) => _list.createNewTasks(tasks))
        .then((_list_) => expect(_list_.tasks).toHaveLength(3))
        .catch((e) => {
          throw Error(
            `Creating and adding new tasks to current list failed: ${e.message}`
          );
        });
    });
  });
});
