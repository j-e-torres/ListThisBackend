const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const { db } = require('../../config/sequelize');
const APIError = require('../utils/APIError');
const Task = require('./Task.model');
const User = require('./User.model');

const List = db.define('list', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  listOwner: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'List owner missing',
      },
    },
  },

  listName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'List name required',
      },
      notEmpty: {
        args: true,
        msg: 'List name required',
      },
    },

    set(value) {
      if (typeof value === 'string') {
        this.setDataValue('listName', value.trim());
      } else this.setDataValue('listName', value);
    },
  },

  listNotes: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '',
    validate: {
      notNull: {
        msg: 'invalid value for notes',
      },
    },
  },
});

/**
 * Class Methods
 */

List.getList = async function getList(id) {
  try {
    const list = await List.findByPk(id, {
      include: [Task],
    });

    return list;
  } catch (error) {
    console.log('am i getting hit');
    throw new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'List does not exist',
      isPublic: true,
    });
  }
};

module.exports = List;
