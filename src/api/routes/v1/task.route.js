const router = require('express').Router();
const taskController = require('../../controllers/task.controller.js');
const authMiddleware = require('../../middleware/auth');

/*
 * /v1/tasks
 */

/*
 * Routes require Authenticated users
 */

router.use(authMiddleware.authenticate);

router.route('/').post(taskController.createTask);

router.route('/:taskId/complete').patch(taskController.completeTask);

router.route('/:taskId').delete(taskController.deleteTask);

module.exports = router;
