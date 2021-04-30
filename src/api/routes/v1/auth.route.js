const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const authMiddleware = require('../../middleware/auth');

// /v1/auth

router.route('/register').post(authController.register);

module.exports = router;
