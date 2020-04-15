const { Group } = require('../../server/db/models/');
const db = require('../../server/db/db');

const validationTester = require('../testHelperFunctions');

describe('Group Model Tests', () => {
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
    return Promise.all([Group.truncate({ cascade: true })]);
  });

  describe('attributes definition', () => {
    test('Includes `id`, `groupName` fields', () => {
      expect(newGroup).toHaveProperty('id');
      expect(newGroup).toHaveProperty('groupName');
      expect(newGroup).toHaveProperty('groupOwner');
    });
  });

  describe('Specific properties', () => {
    describe('Group name property', () => {
      test('groupName cannot be null', async () => {
        await validationTester(
          newGroup,
          'groupName',
          null,
          'groupName notNull',
          'is_null',
          'Group name required'
        );
      });

      test('groupName cannot be empty', async () => {
        await validationTester(
          newGroup,
          'groupName',
          '',
          'groupName notEmpty',
          'notEmpty',
          'Group name cannot be empty'
        );
      });

      // test('groupName must be unique', async () => {
      //   let error;
      //   try {
      //     await newGroup.save();
      //     newerGroup = Group.build({
      //       groupName: 'family',
      //     });
      //     await newerGroup.save();
      //   } catch (err) {
      //     error = err;
      //   }

      //   if (error) {
      //     const notEmptyError = error.errors.find(
      //       (e) => e.validatorKey === 'not_unique'
      //     );

      //     if (notEmptyError)
      //       expect(notEmptyError.message).toBe('Group name already in use!');
      //   } else throw Error('groupName validation failed');
      // });
    });
  });

  describe('group model functions', () => {
    test('new list can be added to current group', () => {
      const newList = {
        listName: 'trader joes',
      };

      return newGroup
        .save()
        .then((group) => {
          return group.createListToGroup(newList);
        })
        .then((_list) => {
          return expect(_list.groupId).toBe(newGroup.id);
        })
        .catch((e) => {
          throw Error(`Adding user to group failed: ${e.message}`);
        });
    });
  });
});
