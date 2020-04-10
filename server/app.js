const express = require('express');
const app = express();
const { User } = require('./db/models');

app.use(express.json());

app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return next();
  }

  User.exchangeTokenForUser(req.headers.authorization)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(next);
});

app.use('/api', require('./api'));

//error handling
app.use((error, req, res, next) => {
  let errors;
  if (error.errors) {
    errors = error.errors.map((err) => err.message);
  } else if (error.original) {
    errors = [error.original.message];
  } else {
    errors = [error.message];
  }

  console.error(errors);
  res.status(error.status || 500).send({ errors });
});

module.exports = app;
