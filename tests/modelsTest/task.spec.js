const { Task } = require('../../server/db/models/');
const db = require('../../server/db/db');

const { validationTester } = require('../testHelperFunctions');

describe('Task model test', () => {
  beforeAll(() => {
    return db.sync({ force: true });
  });

  let newTask;
  beforeEach(() => {
    newTask = Task.build({
      taskName: 'eggs',
    });
  });

  /**
   *  empty the tables after each spec
   */

  afterEach(() => {
    return Promise.all([Task.truncate({ cascade: true })]);
  });

  describe('attributes definition', () => {
    test('Includes `id`, `taskName` fields', () => {
      expect(newTask).toHaveProperty('id');
      expect(newTask).toHaveProperty('taskName');
      expect(newTask).toHaveProperty('completed');
    });
  });

  describe('Specific properties', () => {
    describe('Task Name property', () => {
      test('taskName cannot be null', async () => {
        await validationTester(
          newTask,
          'taskName',
          null,
          'taskName notNull',
          'is_null',
          'Task name required'
        );
      });
    });

    test('taskName cannot be empty', async () => {
      await validationTester(
        newTask,
        'taskName',
        '',
        'taskName notEmpty',
        'notEmpty',
        'Task name cannot be empty'
      );
    });

    describe('task model functions', () => {
      test('Task can be completed', () => {
        return newTask
          .save()
          .then((task) => {
            return task.completeTask(task);
          })
          .then((_task) => {
            return expect(_task.completed).toBe(true);
          })
          .catch((e) => {
            throw Error(`Task could not be completed due to: ${e.message}`);
          });
      });
    });
  });
});
