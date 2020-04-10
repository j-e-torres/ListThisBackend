// const router = require('./index');
const router = require('express').Router();
const { User } = require('../db/models');

// /api/auth/login below

router.post('/login', (req, res, next) => {
  User.authenticate(req.body)
    .then((token) => {
      res.send({ token });
    })
    .catch(next);
});

router.get('/login', (req, res, next) => {
  if (!req.user) {
    const error = new Error('Not logged in');
    error.status = 401;
    return next(error);
  }
  res.send(req.user);
});

module.exports = router;
