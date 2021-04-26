const httpStatus = require('http-status');
const jwt = require('jwt-simple');
const { User } = require('../models');
const { roles } = require('../utils/constants');
const { jwtSecret } = require('../../config/vars');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

// const catchAsync = (fn) => (req, res, next) => {
//   fn(req, res, next).catch(next);
// };

exports.authenticate = async (req, res, next) => {
  let token;

  console.log('authenticate req', req.headers);
  // 1) get token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('authenticate token', token);

  if (!token) {
    return next(new Error('You are not logged in'));
  }

  // 2) verify token
  const decoded = await jwt.decode(token, jwtSecret);

  console.log('authenticate decodded', decoded);

  // 3) check if user exists
  const currentUser = await User.findByPk(decoded.id);

  if (!currentUser) {
    return next(new Error('User with this token no longer exists'));
  }

  // 4) if user changed password after token issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password, please log in again', 401)
  //   );

  // console.log('authenticate curentuser', currentUser);

  // }

  // grant access
  req.user = currentUser;
  return next();
};

exports.authorize = (role = roles) => (req, res, next) => {
  console.log('authorize req.user', req.user);

  if (!role.includes(req.user.role)) {
    return next(new Error('You do not have permission to do this'));
  }

  return next();
};

// const handleJWT = (req, res, next, roles) => async (err, user, info) => {
//   const error = err || info;
//   const logIn = Promise.promisify(req.logIn);
//   const apiError = new APIError({
//     message: error ? error.message : 'Unauthorized',
//     status: httpStatus.UNAUTHORIZED,
//     stack: error ? error.stack : undefined,
//   });

//   try {
//     if (error || !user) throw error;
//     await logIn(user, { session: false });
//   } catch (e) {
//     return next(apiError);
//   }

//   if (roles === LOGGED_USER) {
//     if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
//       apiError.status = httpStatus.FORBIDDEN;
//       apiError.message = 'Forbidden';
//       return next(apiError);
//     }
//   } else if (!roles.includes(user.role)) {
//     apiError.status = httpStatus.FORBIDDEN;
//     apiError.message = 'Forbidden';
//     return next(apiError);
//   } else if (err || !user) {
//     return next(apiError);
//   }

//   req.user = user;

//   return next();
// };

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;
