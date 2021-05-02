const httpStatus = require('http-status');
const { User, List, Task } = require('../models');
const APIError = require('../utils/APIError');
const createSeedInstance = require('../utils/createSeedInstance');

exports.createList = async (req, res, next) => {
  const { list, userId, tasks } = req.body;
  let _list;
  let user;
  let _tasks;

  if (!list.listName || !list.listOwner) {
    return next(
      new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'List name required',
        isPublic: true,
      })
    );
  }

  try {
    _list = await List.create(list);
    user = await User.findByPk(userId);
    _tasks = await createSeedInstance(Task, tasks);

    await _list.addTasks(_tasks);
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
    return next(APIError(error));
  }

  return next();
};
