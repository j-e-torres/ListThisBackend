const router = require('express').Router();
const { List, Task } = require('../db/models');

// /api/lists

router.get('/', (req, res, next) => {
  List.findAll()
    .then((lists) => res.send(lists))
    .catch(next);
});

router.get('/:id/tasks', (req, res, next) => {
  Task.findAll({ where: { listId: req.params.id } })
    .then((tasks) => res.send(tasks))
    .catch(next);
});

router.post('/:id/tasks', (req, res, next) => {
  List.findByPk(req.params.id)
    .then((list) => list.createNewTask(req.body))
    .then((task) => res.send(task))
    .catch(next);
});

module.exports = router;
