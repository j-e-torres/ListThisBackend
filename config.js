const ENV = process.env.ENV || 'DEV';

try {
  Object.assign(process.env, require('./.env.js')[ENV]);
} catch (err) {}

const get = (key) => {
  return process.env[key];
};

module.exports = { get };
