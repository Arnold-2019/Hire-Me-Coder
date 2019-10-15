var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var invitationRouter = require('./routes/assessment');
var questionsRouter = require('./routes/questions');
var testRouter = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pug'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "XADXAD"}));
app.use(express.static(path.join(__dirname, 'public')));

// nick pugs
app.use(express.static('views/pug'));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/assessment', invitationRouter);
app.use('/questions', questionsRouter);
app.use('/test', testRouter);

// firestore config
const firebase = require('firebase-admin');
const serviceAccount = require('./firebase-service-account-key.json');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('page-error');
  res.render('error');
});

module.exports = app;