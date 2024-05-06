var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./models').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// create Sequelize instance and test connection
(async () => {
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await sequelize.sync();
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
})();

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';

  console.error(`Error ${err.status}: ${err.message}`);

  res.status(err.status);
  res.render('error', { err }); 
});

module.exports = app;
