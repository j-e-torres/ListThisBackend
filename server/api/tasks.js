const router = require('express').Router();
const { Task } = require('../db/models');

// /api/tasks
router.get('/', (req, res, next) => {
  Task.findAll()
    .then((tasks) => res.send(tasks))
    .catch(next);
});

module.exports = router;
