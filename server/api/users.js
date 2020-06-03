const router = require('express').Router();
const { User, Group, List, Task } = require('../db/models');

// /api/users

router.get('/:id/groups', (req, res, next) => {
  Group.findAll({
    include: [
      {
        model: User,
        where: { id: req.params.id },
      },
      {
        model: List,
      },
    ],
  })
    .then((groups) => res.send(groups))
    .catch(next);
});

router.get('/', (req, res, next) => {
  User.findAll({
    include: [
      {
        model: Group,
      },
    ],
  })
    .then((users) => res.send(users))
    .catch(next);
});

router.post('/', (req, res, next) => {
  User.signUp(req.body)
    .then((token) => res.send({ token }))
    .catch(next);
});

router.post('/:id/groups', (req, res, next) => {
  User.findByPk(req.params.id)
    .then((user) => {
      return user.createNewGroup(req.body);
    })
    .then((group) =>
      Group.findByPk(group.id, {
        include: [{ model: User }],
      }).then((_group) => _group)
    )
    .then((__group) => res.send(__group))
    .catch(next);
});

// /:userId/groups/:groupId

router.post('/:userId/groups/:groupId', async (req, res, next) => {
  Promise.all([
    User.findByPk(req.params.userId),
    Group.findByPk(req.params.groupId),
    User.findOne({
      where: { username: req.body.username },
    }),
  ])
    .then(([groupOwner, group, addUser]) => {
      return groupOwner.addUserToGroup(addUser, group);
    })
    .then((usergroup) => {
      // console.log('users api, usergroup[0]', usergroup[0].userId);

      return User.findByPk(usergroup[0].userId);
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
});

module.exports = router;
