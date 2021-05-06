const httpStatus = require('http-status');
const { User, List, Task } = require('../models');
const APIError = require('../utils/APIError');
const { checkArray } = require('./utils');
const createSeedInstance = require('../utils/createSeedInstance');

exports.createList = async (req, res, next) => {
  const { list, userId, tasks } = req.body;
  let _list;
  let user;
  let _tasks;

  const err = new APIError({
    status: httpStatus.BAD_REQUEST,
    message: httpStatus.BAD_REQUEST,
    isPublic: true,
  });

  if (!list.listName || !list.listOwner) {
    err.message = 'List name required';
    return next(err);
  }

  if (!Array.isArray(tasks) || tasks.length < 1) {
    err.message = 'Tasks sent are invalid format';
    return next(err);
  }

  try {
    _list = await List.create(list);
    user = await User.getUser(userId);
    _tasks = await Task.createTasks({ tasks, listId: _list.id });

    await user.addList(_list);

    const updatedList = await List.findByPk(_list.id, {
      include: [
        {
          model: Task,
        },
      ],
    });

    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      data: {
        list: updatedList,
      },
    });
  } catch (error) {
    return next(error);
  }

  return next();
};
