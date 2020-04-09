// const router = require('./index');
const router = require('express').Router();
const { User } = require('../db/models');

// /api/auth/:router below

router.post('/login', (req, res, next) => {
  User.authenticate(req.body)
    .then((token) => {
      res.send(token);
    })
    .catch(next);
});

module.exports = router;
