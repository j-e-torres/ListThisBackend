const router = require('express').Router();

router.use('/auth', require('./auth'));

// router.use('/families', require('./families'));

// router.use('/polls', require('./polls'));

// router.use('/moods', require('./moods'));

// router.use('/events', require('./events'));

// router.use('/alerts', require('./alerts'));

module.exports = router;
