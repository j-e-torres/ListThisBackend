const router = require('express').Router();
const authController = require('../../controllers/auth.controller');

// /v1/auth

router.route('/register').post(authController.register);

router.route('/login').post(authController.login);

module.exports = router;
