const httpStatus = require('http-status');
const jwt = require('jwt-simple');
const { User } = require('../models');
const { jwtSecret } = require('../../config/vars');
const APIError = require('../utils/APIError');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

const authorized = [ADMIN];

exports.authenticate = async (req, res, next) => {
  let token;
  let bearer;
  let decoded;
  let currentUser;

  const apiError = new APIError({
    message: 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    isPublic: true,
  });

  // 1) get token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    [bearer, token] = req.headers.authorization.split(' ');
  } else {
    return next(apiError);
  }

  if (!token) {
    return next(apiError);
  }

  // 2) verify token
  try {
    decoded = await jwt.decode(token, jwtSecret);
  } catch (error) {
    apiError.message = 'Invalid token';
    return next(apiError);
  }

  // 3) check if user exists

  try {
    currentUser = await User.getUser(decoded.id);
  } catch (error) {
    return next(error);
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
  const apiError = new APIError({
    message: 'You do not have permission to do this',
    status: httpStatus.FORBIDDEN,
    isPublic: true,
  });

  if (!roles.includes(req.user.role)) {
    return next(apiError);
  }

  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;
