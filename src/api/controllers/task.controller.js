const httpStatus = require('http-status');
const { Task } = require('../models');
const APIError = require('../utils/APIError');

exports.createTask = async (req, res, next) => {
  const { listId, tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length < 1) {
    return next(
      new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `Tasks sent are invalid format`,
        isPublic: true,
      })
    );
  }

  try {
    const createdTasks = await Task.createTasks(req.body);

    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      data: {
        tasks: createdTasks,
      },
    });
  } catch (error) {
    return next(error);
  }

  return next();
};
