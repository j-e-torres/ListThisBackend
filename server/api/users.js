const router = require('express').Router();
const { User, Group } = require('../db/models');

// /api/users/:id/groups
router.get('/:token/groups', (req, res, next) => {
  Group.findAll({
    include: [
      {
        model: User,
        where: { id: req.params.token },
      },
    ],
  })
    .then((groups) => res.send(groups))
    .catch(next);
});

module.exports = router;
