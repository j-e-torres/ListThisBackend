const router = require('express').Router();
const { User, List } = require('../db/models');

// /api/users

// get lists that belong to user
router.get('/:id/lists', (req, res, next) => {
  List.findAll({
    include: [
      {
        model: User,
        where: { id: req.params.id },
      },
    ],
  })
    .then((lists) => res.send(lists))
    .catch(next);
});

//get all users include model list
router.get('/', (req, res, next) => {
  User.findAll({
    include: [
      {
        model: List,
      },
    ],
  })
    .then((users) => res.send(users))
    .catch(next);
});

// create new user
router.post('/', (req, res, next) => {
  User.signUp(req.body)
    .then((token) => res.send({ token }))
    .catch(next);
});

// create new List
router.post('/:id/lists', (req, res, next) => {
  User.findByPk(req.params.id)
    .then((user) => {
      return user.createNewList(req.body);
    })
    .then((list) =>
      List.findByPk(list.id, {
        include: [{ model: User }],
      }).then((_list) => _list)
    )
    .then((__list) => res.send(__list))
    .catch(next);
});

// add user to a list
router.post('/:userId/lists/:listId', async (req, res, next) => {
  Promise.all([
    User.findByPk(req.params.userId),
    List.findByPk(req.params.listId),
    User.findOne({
      where: { username: req.body.username },
    }),
  ])
    .then(([listOwner, list, addUser]) => {
      return listOwner.addUserToList(addUser, list);
    })
    .then((userlist) => {
      return User.findByPk(userlist[0].userId, {
        include: [{ model: List }],
      });
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
});

module.exports = router;
