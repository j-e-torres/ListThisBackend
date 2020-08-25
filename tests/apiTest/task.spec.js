/* eslint-disable node/no-unpublished-require */
const app = require('supertest')(require('../../server/app'));
const db = require('../../server/db/db');
const { Task } = require('../../server/db/models');

describe('task api', () => {
  beforeAll(() => db.sync({ force: true }));

  let newTask;
  beforeEach(() => {
    newTask = Task.build({
      taskName: 'fish',
    });
  });

  /**
   * Also, we empty the tables after each spec
   */

  afterEach(() => Promise.all([Task.truncate({ cascade: true })]));

  test('can get all tasks', async () => {
    await newTask.save();

    const response = await app.get('/api/tasks').expect(200);

    expect(response.body).toHaveLength(1);
  });

  test('can complete task', async () => {
    await newTask.save();

    const res = await app.put(`/api/tasks/${newTask.id}`).expect(200);

    expect(res.body.completed).toBe(true);
  });

  // eslint-disable-next-line jest/expect-expect
  test('can delete task', async () => {
    await newTask.save();

    await app.delete(`/api/tasks/${newTask.id}`).expect(204);
  });
});
