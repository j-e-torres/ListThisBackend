/* eslint-disable no-param-reassign */
const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const jwt = require('jwt-simple');
const httpStatus = require('http-status');
const { db } = require('../../config/sequelize');
const { jwtSecret } = require('../../config/vars');
const { roles } = require('../utils/constants');
const APIError = require('../utils/APIError');
const List = require('./List.model');
const Task = require('./Task.model');

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
            'Password must be at least 6 characters long, lowercase/uppercase letters, at least 1 number.',
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
// eslint-disable-next-line consistent-return
User.authenticate = async function authenticate(options) {
  const { username, password } = options;

  if (!username || !password) {
    throw new APIError({
      status: httpStatus.BAD_REQUEST,
      message: 'Incorrect username or password',
      isPublic: true,
    });
  }

  try {
    const user = await this.scope('login').findOne({
      where: { username },
      include: [
        {
          model: List,
          include: [
            {
              model: Task,
            },
          ],
        },
      ],
    });

    if (user && (await user.passwordMatches(password))) {
      return { user, accessToken: user.token() };
    }
  } catch (error) {
    return new APIError(error);
  }
};

User.checkDuplicateUsername = function checkDuplicateUsername(error) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return new APIError({
      message: error.name,
      errors: error.errors,
      status: httpStatus.CONFLICT,
      isPublic: true,
      stack: error.stack,
    });
  }
  return error;
};

User.getUser = async function getUser(id) {
  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: List,
          include: [Task],
        },
      ],
    });
    return user;
  } catch (error) {
    throw new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'User does not exist',
      isPublic: true,
    });
  }
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
