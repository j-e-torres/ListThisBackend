const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const error = require('../api/middleware/error');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(helmet());

app.use(cors());

// mount api v1 routes
app.use('/v1', routes);

// catch 404 and forward to error handler
app.use(error.notFound);

// // error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
