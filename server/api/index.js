const router = require('express').Router();

router.use('/auth', require('./auth'));

router.use('/users', require('./users'));

router.use('/lists', require('./lists'));

router.use('/tasks', require('./tasks'));

module.exports = router;
