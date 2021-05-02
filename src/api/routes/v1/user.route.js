const router = require('express').Router();
const userController = require('../../controllers/user.controller.js');
const authMiddleware = require('../../middleware/auth');

/*
 * /v1/users
 */

router.use(authMiddleware.authenticate);

router.route('/').get(authMiddleware.authorize(), userController.getUsers);

module.exports = router;
