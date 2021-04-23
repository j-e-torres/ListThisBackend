const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(helmet());

app.use(cors());

// mount api v1 routes
app.use('/v1', routes);

// app.use((req, res, next) => {
//   const err = new Error('No Page Found');
//   err.status = 404;
//   next(err);
// });

// // error handling
// app.use((error, req, res, next) => {
//   let errors;
//   if (error.errors) {
//     errors = error.errors.map((err) => err.message);
//   } else if (error.original) {
//     errors = [error.original.message];
//   } else {
//     errors = [error.message];
//   }

//   // console.error(errors);
//   res.status(error.status || 500).send({ errors });
// });

module.exports = app;
