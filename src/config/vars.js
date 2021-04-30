const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  postgres: {
    uri:
      process.env.NODE_ENV === 'test'
        ? process.env.SEQUELIZE_URI_TESTS
        : process.env.DATABASE_URL || process.env.SEQUELIZE_URI,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
};
