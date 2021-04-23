const router = require('express').Router();

const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const listRoutes = require('./list.route');
const taskRoutes = require('./task.route');

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/lists', listRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
