const httpStatus = require('http-status');
const { Task } = require('../models');
const APIError = require('../utils/APIError');

exports.createTask = async (req, res, next) => {
  const { tasks } = req.body;

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

exports.completeTask = async (req, res, next) => {
  try {
    const task = await Task.getTask(req.params.taskId);
    const completed = await task.completeTask();

    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: {
        task: completed,
      },
    });
  } catch (error) {
    return next(error);
  }

  return next();
};