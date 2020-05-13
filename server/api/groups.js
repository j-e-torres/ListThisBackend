const router = require('express').Router();
const { User, Group, List, Task } = require('../db/models');

// /api/groups/
router.get('/:id/users', (req, res, next) => {
  User.findAll({
    include: [
      {
        model: Group,
        where: { id: req.params.id },
      },
    ],
  })
    .then((users) => res.send(users))
    .catch(next);
});

router.get('/:id/lists', (req, res, next) => {
  List.findAll({
    where: { groupId: req.params.id },
    include: [
      {
        model: Task,
      },
    ],
  })
    .then((lists) => res.send(lists))
    .catch(next);
});

router.post('/:id/lists', (req, res, next) => {
  Group.findByPk(req.params.id)
    .then((group) => group.createListToGroup(req.body))
    .then((list) =>
      List.findByPk(list.id, {
        include: [{ model: Task }],
      }).then((_list) => _list)
    )
    .then((__list) => res.send(__list))
    .catch(next);
});

module.exports = router;
