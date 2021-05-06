const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

exports.checkArray = (data, dataType, next) => {
  if (!Array.isArray(data) || data.length < 1) {
    return next(
      new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `${dataType} sent are invalid format`,
      })
    );
  }
};
