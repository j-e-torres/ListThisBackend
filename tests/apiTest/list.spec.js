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

  test('get all lists', async () => {
    await app.get('/api/lists').expect(200);
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

  test('Create and add array of new tasks to list', async () => {
    await newList.save();

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

    const response = await app
      .post(`/api/lists/${newList.id}/tasks`)
      .send(tasks)
      .expect(200);

    expect(response.body.tasks.length).toBe(3);
  });

  test('can update list notes', async () => {
    await newList.save();

    const notes = {
      listNotes: 'buy 3 of each',
    };

    const response = await app
      .put(`/api/lists/${newList.id}/notes`)
      .send(notes)
      .expect(200);

    expect(response.body.listNotes).toBe('buy 3 of each');
    // expect(response.body.listId).toBe(newList.id);
  });
});
