const app = require('supertest')(require('../../server/app'));
const db = require('../../server/db/db');
const { Task } = require('../../server/db/models');

describe('task api', () => {
  beforeAll(() => {
    return db.sync({ force: true });
  });

  let newTask;
  beforeEach(() => {
    newTask = Task.build({
      taskName: 'fish',
    });
  });

  /**
   * Also, we empty the tables after each spec
   */

  afterEach(() => {
    return Promise.all([Task.truncate({ cascade: true })]);
  });

  test('get all tasks', async () => {
    await app.get('/api/tasks').expect(200);
  });
});
