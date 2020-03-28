const db = require('../db');
const { Sequelize } = db;

// const passwordStrength = new RegExp(
//   '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})'
// );

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
      set(val) {
        this.setDataValue('username', val.toLowerCase());
      },
      validate: {
        notNull: {
          msg: 'Username required'
        },
        notEmpty: true,
        isAlphanumeric: {
          args: true,
          msg: 'Username must consist of letters and numbers'
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
        notEmpty: true,
        is: {
          args: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})',
          msg:
            'Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.'
        }
        // passwordTest(password) {
        //   if (passwordStrength.test(password)) {
        //     console.log('error thrown on password');
        //     throw new Error(
        //       'Passwords must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.'
        //     );
        //   }
        // }
      }
    },

    displayName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Display name required'
        },
        notEmpty: true,
        isAlphanumeric: {
          args: true,
          msg: 'Display name must consist of letters and numbers'
        }
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
