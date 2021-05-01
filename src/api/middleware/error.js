const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { env } = require('../../config/vars');

/**
 * Error handler. Send stacktrace only during development
 */
const handler = (err, req, res, next) => {
  // if (error.errors) {
  //   errors = error.errors.map((err) => err.message);
  // } else if (error.original) {
  //   errors = [error.original.message];
  // } else {
  //   errors = [error.message];
  // }

  // console.error(errors);

  const response = {
    status: err.status || 500,
    message: err.message || httpStatus.INTERNAL_SERVER_ERROR,
    errors: err.errors,
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }

  res.status(err.status || 500).json(response);
};
exports.handler = handler;

// /**
//  * If error is not an instanceOf APIError, convert it.
//  * @public
//  */
// exports.converter = (err, req, res, next) => {
//   let convertedError = err;

//   if (err instanceof expressValidation.ValidationError) {
//     convertedError = new APIError({
//       message: 'Validation Error',
//       errors: err.errors,
//       status: err.status,
//       stack: err.stack,
//     });
//   } else if (!(err instanceof APIError)) {
//     convertedError = new APIError({
//       message: err.message,
//       status: err.status,
//       stack: err.stack,
//     });
//   }

//   return handler(convertedError, req, res);
// };

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};
