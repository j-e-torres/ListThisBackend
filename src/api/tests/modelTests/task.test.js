const { Task } = require('../../models');
const { db } = require('../../../config/sequelize');

describe('Task model test', () => {
  beforeAll(() => db.sync({ force: true }));

  let newTask;
  beforeEach(() => {
    newTask = Task.build({
      taskName: 'eggs',
    });
  });

  /**
   *  empty the tables after each spec
   */

  afterEach(() => Promise.all([Task.truncate({ cascade: true })]));

  describe('Task attributes section', () => {
    test('Includes `id`, `taskName`, `completed` fields', () => {
      expect(newTask).toHaveProperty('id');
      expect(newTask).toHaveProperty('taskName');
      expect(newTask).toHaveProperty('completed');
    });
  });

  describe('taskName property', () => {
    test('Should report `Task name required` when taskName is null', async () => {
      newTask.taskName = null;

      let errorResult;

      try {
        await newTask.validate();
      } catch (error) {
        [errorResult] = error.errors;
      }

      expect(errorResult.message).toBe('Task name required');
    });

    test('Should report `Task name required` when taskName is empty', async () => {
      newTask.taskName = '';

      let errorResult;

      try {
        await newTask.validate();
      } catch (error) {
        [errorResult] = error.errors;
      }

      expect(errorResult.message).toBe('Task name required');
    });
  });

  describe('completed property', () => {
    test('defaultValue should be false', async () => {
      await newTask.save();

      const found = await Task.findByPk(newTask.id);

      expect(found.completed).toBe(false);
    });
  });
});
