const { List } = require('../../models');
const { db } = require('../../../config/sequelize');

describe('List model test', () => {
  beforeAll(() => db.sync({ force: true }));

  let newList;
  beforeEach(() => {
    newList = List.build({
      listName: 'trader joes',
      listOwner: 'jacob',
    });
  });

  afterEach(() => Promise.all([List.truncate({ cascade: true })]));

  describe('List attributes section', () => {
    test('Should have `id`, `listName`, `listNotes`, `listOwner` fields', () => {
      expect(newList).toHaveProperty('id');
      expect(newList).toHaveProperty('listName');
      expect(newList).toHaveProperty('listNotes');
      expect(newList).toHaveProperty('listOwner');
    });

    describe('listName property', () => {
      test('Should trim `List name`', async () => {
        newList.listName = '  list ';

        await newList.save();

        const list = await List.findByPk(newList.id);

        expect(list.listName).toBe('list');
      });

      test('Should report `List name required` when listName is null', async () => {
        newList.listName = null;

        let errorResult;

        try {
          await newList.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }

        expect(errorResult.message).toBe('List name required');
      });

      test('Should report `List name required` when listName is empty', async () => {
        newList.listName = '';

        let errorResult;

        try {
          await newList.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }

        expect(errorResult.message).toBe('List name required');
      });
    });

    describe('listNotes property', () => {
      test('Should report `invalid value for notes` when listNotes is null', async () => {
        newList.listNotes = null;

        let errorResult;

        try {
          await newList.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }

        expect(errorResult.message).toBe('invalid value for notes');
      });

      test('Should have empty defaultValue', async () => {
        await newList.save();

        const foundList = await List.findByPk(newList.id);

        expect(foundList.listNotes).toBe('');
      });
    });

    describe('listOwner property', () => {
      test('Should report `List owner missing` when listOwner is null', async () => {
        newList.listOwner = null;

        let errorResult;

        try {
          await newList.validate();
        } catch (error) {
          [errorResult] = error.errors;
        }

        expect(errorResult.message).toBe('List owner missing');
      });
    });
  });
});
