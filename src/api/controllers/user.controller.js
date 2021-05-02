const httpStatus = require('http-status');
const { User, List } = require('../models');
const APIError = require('../utils/APIError');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: List,
        },
      ],
    });

    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(APIError(error));
  }
};
