const app = require('supertest')(require('../../server/app'));
const db = require('../../server/db/db');
const { List, Task } = require('../../server/db/models');

describe('list api tests', () => {
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
   * Also, we empty the tables after each spec
   */

  afterEach(() => {
    return Promise.all([
      List.truncate({ cascade: true }),
      Task.truncate({ cascade: true }),
    ]);
  });

  test('Get all tasks that belong to a list', async () => {
    await newList.save();

    const [task1, task2, task3] = await Promise.all([
      Task.create({
        taskName: 'fish',
      }),
      Task.create({
        taskName: 'soup',
      }),
      Task.create({
        taskName: 'apples',
      }),
    ]);

    await newList.setTasks([task1, task2, task3]);

    const response = await app
      .get(`/api/lists/${newList.id}/tasks`)
      .expect(200);

    expect(response.body.length).toBe(3);
  });
});
