const httpStatus = require('http-status');
const { User, List } = require('../models');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: List,
        },
      ],
    });

    res.status(200).json({
      status: httpStatus.OK,
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};
