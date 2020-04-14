const router = require('express').Router();
const { Task } = require('../db/models');

// /api/lists

router.get('/:id/tasks', (req, res, next) => {
  Task.findAll({ where: { listId: req.params.id } })
    .then((tasks) => res.send(tasks))
    .catch(next);
});

module.exports = router;
