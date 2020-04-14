const app = require('supertest')(require('../../server/app'));
const db = require('../../server/db/db');
const { User, Group, List } = require('../../server/db/models');

describe('group api tests', () => {
  beforeAll(() => {
    return db.sync({ force: true });
  });

  let newGroup;
  beforeEach(() => {
    newGroup = Group.build({
      groupName: 'family',
    });
  });

  /**
   * Also, we empty the tables after each spec
   */

  afterEach(() => {
    return Promise.all([
      Group.truncate({ cascade: true }),
      Group.truncate({ cascade: true }),
      List.truncate({ cascade: true }),
    ]);
  });

  test('Get all users that belong to a group', async () => {
    await newGroup.save();

    const [user1, user2, user3] = await Promise.all([
      User.create({
        username: 'ubern00bi3',
        password: 'La1La1',
        displayName: 'fishy',
      }),
      User.create({
        username: 'yeahboi',
        password: 'La1La1',
        displayName: 'fisy',
      }),
      User.create({
        username: 'yeahson',
        password: 'La1La1',
        displayName: 'fisheey',
      }),
    ]);

    await newGroup.setUsers([user1, user2, user3]);

    const response = await app
      .get(`/api/groups/${newGroup.id}/users`)
      .expect(200);

    expect(response.body.length).toBe(3);
  });

  test('Get all lists that belong to a group', async () => {
    await newGroup.save();

    const [list1, list2, list3] = await Promise.all([
      List.create({
        listName: 'trader joes',
      }),
      List.create({
        listName: 'family dollar',
      }),
      List.create({
        listName: 'cvs',
      }),
    ]);

    await newGroup.setLists([list1, list2, list3]);

    const response = await app
      .get(`/api/groups/${newGroup.id}/lists`)
      .expect(200);

    expect(response.body.length).toBe(3);
  });

  // test('Group admin can add user to group route', async () => {
  //   newGroup.groupOwner = 'ubern00bi3';
  //   await newGroup.save();

  //   // const user =

  //   const response = await app
  //     .post(`/api/groups/${newGroup.id}/users`)
  //     .send()
  //     .expect(200);
  // });
});
