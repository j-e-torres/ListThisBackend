const db = require('../db');
const { Sequelize } = db;
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const config = require('../../../config');

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
        msg: 'username already in use!',
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username required',
        },
        notEmpty: {
          args: true,
          msg: 'Username cannot be empty',
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
          msg: 'Password cannot be empty',
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
      beforeSave: function (user) {
        if (user.password) {
          return bcrypt
            .hash(user.password, 5)
            .then((hash) => {
              user.password = hash;
              user.username = user.username.toLowerCase();
              // return user;
            })
            .catch((err) => console.error(err));
        }
      },
    },

    scopes: {
      login: {},
    },
  }
);

// class methods

User.exchangeTokenForUser = async function (token) {
  try {
    const userId = await jwt.decode(token, config.get('JWT_ACCESS_TOKEN')).id;

    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error();
    } else {
      return user;
    }
  } catch (err) {
    const error = new Error('Bad token');
    error.status = 401;
    throw error;
  }
};

User.authenticate = function ({ username, password }) {
  username = username.toLowerCase();

  let _user;
  return this.scope('login')
    .findOne({ where: { username } })
    .then((user) => {
      if (!user) {
        const error = new Error('Username or password is invalid');
        error.status = 401;
        throw error;
      }
      _user = user;

      return bcrypt.compare(password, user.password);
    })
    .then((authenticated) => {
      if (authenticated)
        return jwt.encode({ id: _user.id }, config.get('JWT_ACCESS_TOKEN'));

      const error = new Error('Username or password is invalid');
      error.status = 401;
      throw error;
    });
};

User.signUp = function ({ username, password, displayName }) {
  return User.create({ username, password, displayName })
    .then((user) => {
      return jwt.encode({ id: user.id }, config.get('JWT_ACCESS_TOKEN'));
    })
    .catch((e) => {
      throw e;
    });
};

// instance methods
User.prototype.createNewGroup = function (group) {
  return this.createGroup(group)
    .then((_group) => {
      return _group.update({ groupOwner: this.username });
    })
    .catch((e) => {
      throw e;
    });
};

User.prototype.addUserToGroup = function (newUser, group) {
  if (group.groupOwner === this.username) {
    return newUser.addGroup(group);
  } else {
    throw new Error('User is not a group owner');
  }
};

module.exports = User;
