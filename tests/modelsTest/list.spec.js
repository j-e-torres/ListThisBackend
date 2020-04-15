const { List } = require('../../server/db/models/');
const db = require('../../server/db/db');

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
      expect(newList).toHaveProperty('listNotes');
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
    test('Can create and add new task to current list', () => {
      const newTask = {
        taskName: 'oranges',
      };

      return newList
        .save()
        .then((_list) => {
          return _list.createNewTask(newTask);
        })
        .then((_task) => {
          return expect(_task.listId).toBe(newList.id);
        })
        .catch((e) => {
          throw Error(
            `Creating and adding new task to current list failed: ${e.message}`
          );
        });
    });
  });
});
