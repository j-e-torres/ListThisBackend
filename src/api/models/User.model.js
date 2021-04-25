/* eslint-disable no-param-reassign */
const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const jwt = require('jwt-simple');
const httpStatus = require('http-status');
const { db } = require('../../config/sequelize');
const { jwtSecret } = require('../../config/vars');

const roles = ['user', 'admin'];

const User = db.define(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    role: {
      type: Sequelize.ENUM,
      values: roles,
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [roles],
          msg: 'Invalid User role',
        },
      },
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
          msg: 'Username must consist of letters or numbers',
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
          msg: 'Display name required',
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
      async beforeSave(user) {
        user.username = user.username.toLowerCase();

        try {
          user.password = await bcryptjs.hash(user.password, 12);
        } catch (error) {
          console.error(error);
        }
      },
    },

    scopes: {
      login: {},
    },
  }
);

// model methods
User.authenticate = async function authenticate(options) {
  const { username, password } = options;
  if (!username)
    throw new Error({
      message: 'An email is required to generate a token',
    });

  const user = await this.scope('login').findOne({ where: { username } });
  const err = {
    status: httpStatus.UNAUTHORIZED,
    isPublic: true,
  };

  if (password) {
    if (user && (await user.passwordMatches(password))) {
      return { user, accessToken: user.token() };
    }

    err.message = 'Incorrect email or password';
  }

  throw new Error(err);
};

// instance methods
User.prototype.token = function token() {
  const playload = {
    id: this.id,
  };
  return jwt.encode(playload, jwtSecret);
};

User.prototype.passwordMatches = function passwordMatches(password) {
  return bcryptjs.compare(password, this.password);
};

module.exports = User;
