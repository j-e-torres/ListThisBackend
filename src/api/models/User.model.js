const Sequelize = require('sequelize');
const { db } = require('../../config/sequelize');

const User = db.define(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    username: {
      type: Sequelize.STRING,
      unique: {
        args: true,
        msg: 'Username already in use!',
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username required',
        },
        notEmpty: {
          args: true,
          msg: 'Username required',
        },
        isAlphanumeric: {
          args: true,
          msg: 'Username must consist of letters or numbers.',
        },
      },
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password required',
        },
        notEmpty: {
          args: true,
          msg: 'Password required',
        },
        is: {
          args: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})',
          msg:
            'Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.',
        },
      },
    },

    displayName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Display name required',
        },
        notEmpty: {
          args: true,
          msg: 'Display name cannot be empty',
        },
      },
    },
  },

  {
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },

    hooks: {
      beforeSave: {},
    },
  }
);

module.exports = User;
