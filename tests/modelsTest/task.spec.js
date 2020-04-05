const { Task } = require('../../server/db/models/');
const db = require('../../server/db/db');
const SequelizeValidationError = require('sequelize').ValidationError;

const validationTester = require('../testHelperFunctions');

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

    test('taskName must be unique', async () => {
      let error;
      try {
        await newTask.save();
        newerTask = Task.build({
          taskName: 'eggs',
        });
        await newerTask.save();
      } catch (err) {
        error = err;
      }

      if (error) {
        const notEmptyError = error.errors.find(
          (e) => e.validatorKey === 'not_unique'
        );

        if (notEmptyError)
          expect(notEmptyError.message).toBe('Task name already in use!');
      } else throw Error('taskName validation failed');
    });
  });
});
