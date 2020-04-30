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
        include: [Task],
      },
    ],
  })
    .then((groups) => res.send(groups))
    .catch(next);
});

router.get('/', (req, res, next) => {
  User.findAll()
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
    .then((group) => res.send(group))
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
      res.send(usergroup);
    })
    .catch(next);
});

module.exports = router;
