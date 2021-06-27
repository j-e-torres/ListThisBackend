/* eslint-disable no-underscore-dangle */
const httpStatus = require('http-status');
const { List, Task, User } = require('../models');
const APIError = require('../utils/APIError');

exports.createList = async (req, res, next) => {
  const { list, tasks } = req.body;
  const { user } = req;
  let _list;
  // let _tasks;

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
    await Task.createTasks({ tasks, listId: _list.id });
    await user.addList(_list);
    await _list.addUser(user);

    const updatedList = await List.getList(_list.id);

    return res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      data: {
        list: updatedList,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteList = async (req, res, next) => {
  try {
    await List.destroy({ where: { id: req.params.listId } });

    return res.status(httpStatus.NO_CONTENT).json({
      status: httpStatus.NO_CONTENT,
      message: 'Successfully deleted',
    });
  } catch (error) {
    return next(error);
  }
};

exports.addUser = async (req, res, next) => {
  const { username, list } = req.body;
  const { listId } = req.params;
  const { user } = req;

  if (list.listOwner !== user.username) {
    return next(
      new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: 'You are not the list owner',
        isPublic: true,
      })
    );
  }

  /**
   * Get List
   * Get other User
   */
  try {
    const foundList = await List.getList(listId);
    const addUser = await User.findOne({ where: { username } });

    await foundList.addUser(addUser);
    await addUser.addList(foundList);
    const updatedListUsers = await foundList.getUsers();

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: {
        users: updatedListUsers,
      },
    });
  } catch (error) {
    return next(error);
  }
};
