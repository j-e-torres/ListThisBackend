const db = require('../db');
const { Sequelize } = db;

// const passwordStrength = new RegExp(
//   '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})'
// );

// const UsernameConst = 'Username'
// const PasswordConst = 'Password'
// const DisplayNameConst = 'Display name'

// const notNullMsg = 'required.'
// const notEmptyMsg = 'cannot be empty.';
// const isAlphanumericMsg = 'must consist of letters or numbers.';

const User = db.define(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username required'
        },
        notEmpty: {
          args: true,
          msg: 'Username cannot be empty'
        },
        isAlphanumeric: {
          args: true,
          msg: 'Username must consist of letters or numbers.'
        }
      }
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password required'
        },
        notEmpty: {
          args: true,
          msg: 'Password cannot be empty'
        },
        is: {
          args: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})',
          msg:
            'Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.'
        }
      }
    },

    displayName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Display name required'
        },
        notEmpty: {
          args: true,
          msg: 'Display name cannot be empty'
        }
        // isAlphanumeric: {
        //   args: true,
        //   msg: 'Display name must consist of letters and numbers'
        // }
      }
    },

    isGroupAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },

  {
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    }
  }
);

module.exports = User;
