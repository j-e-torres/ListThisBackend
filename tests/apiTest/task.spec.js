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

  test('can get all tasks', async () => {
    await app.get('/api/tasks').expect(200);
  });

  test('can complete task', async () => {
    await newTask.save();

    const res = await app.put(`/api/tasks/${newTask.id}`).expect(200);

    expect(res.body.completed).toBe(true);
  });

  test('can delete task', async () => {
    await newTask.save();

    const res = await app.delete(`/api/tasks/${newTask.id}`).expect(204);
  });
});
