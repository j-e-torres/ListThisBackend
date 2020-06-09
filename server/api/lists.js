const router = require('express').Router();
const { List, Task } = require('../db/models');

// /api/lists

router.get('/', (req, res, next) => {
  List.findAll({
    include: [
      {
        model: Task,
      },
    ],
  })
    .then((lists) => res.send(lists))
    .catch(next);
});

router.get('/:listId/tasks', (req, res, next) => {
  Task.findAll({ where: { listId: req.params.listId } })
    .then((tasks) => res.send(tasks))
    .catch(next);
});

router.post('/:listId/tasks', (req, res, next) => {
  List.findByPk(req.params.listId)
    .then((list) => list.createNewTask(req.body))
    .then((task) => res.send(task))
    .catch(next);
});

router.put('/:listId/notes', (req, res, next) => {
  List.findByPk(req.params.listId)
    .then((list) => list.update(req.body))
    .then((www) => res.send(www))
    .catch(next);
});

module.exports = router;
