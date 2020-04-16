const router = require('express').Router();
const { User, Group, List } = require('../db/models');

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
  })
    .then((lists) => res.send(lists))
    .catch(next);
});

router.post('/:id/lists', (req, res, next) => {
  Group.findByPk(req.params.id)
    .then((group) => group.createListToGroup(req.body))
    .then((list) => res.send(list))
    .catch(next);
});

module.exports = router;
