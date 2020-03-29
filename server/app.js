const express = require('express');
const app = express();

module.exports = app;

app.use(express.json());

//error handling
app.use((error, req, res, next) => {
  let errors;
  if (error.errors) {
    errors = error.errors.map(err => err.message);
  } else if (error.original) {
    errors = [error.original.message];
  } else {
    errors = [error.message];
  }

  console.error(errors);
  res.status(error.status || 500).send({ errors });
});
