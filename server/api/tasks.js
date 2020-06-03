const router = require('express').Router();
const { Task } = require('../db/models');

// /api/tasks
router.get('/', (req, res, next) => {
  Task.findAll()
    .then((tasks) => res.send(tasks))
    .catch(next);
});

router.put('/:taskId', (req, res, next) => {
  Task.findByPk(req.params.taskId)
    .then((task) => task.completeTask())
    .then((something) => res.send(something))
    .catch(next);
});

module.exports = router;
