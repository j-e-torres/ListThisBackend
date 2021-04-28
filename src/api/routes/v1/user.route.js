const router = require('express').Router();
const userController = require('../../controllers/user.controller.js');
const authMiddleware = require('../../middleware/auth');

// router.param('userId', userController.load);

// /v1/users/
router
  .route('/')
  .get(
    authMiddleware.authenticate,
    authMiddleware.authorize(),
    userController.getUsers
  );

module.exports = router;
