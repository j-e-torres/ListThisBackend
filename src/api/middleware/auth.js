const httpStatus = require('http-status');
const jwt = require('jwt-simple');
const { User } = require('../models');
const { jwtSecret } = require('../../config/vars');
const APIError = require('../utils/APIError');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

const authorized = [ADMIN];

const apiError = new APIError({
  message: 'Unauthorized',
  status: httpStatus.UNAUTHORIZED,
  isPublic: true,
});

exports.authenticate = async (req, res, next) => {
  let token;

  // 1) get token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(apiError);
  }

  // 2) verify token
  const decoded = await jwt.decode(token, jwtSecret);

  // 3) check if user exists
  const currentUser = await User.findByPk(decoded.id);

  if (!currentUser) {
    apiError.message = 'User with this token no longer exists';
    return next(apiError);
  }

  // 4) if user changed password after token issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password, please log in again', 401)
  //   );
  // }

  // grant access
  req.user = currentUser;
  return next();
};

exports.authorize = (roles = authorized) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    apiError.message = 'You do not have permission to do this';
    apiError.status = httpStatus.FORBIDDEN;
    return next(apiError);
  }

  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;
