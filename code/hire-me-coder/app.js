var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hiremecoder.pg5@gmail.com',
    pass: 'Sep_group5'
  }
});

var sender = 'noreply@maptek.com';
var addressee = 'ying86y6@gmail.com';
var mailOptions = {
  from: sender,
  to: addressee,
  subject: 'HireMeCoder Invitation!',
  text: 'Wellcome to Hire Me Coder\n\n' + 
        'We have kindly created an account for you, and with this account ' +
        'you can access your invitation assgnments.\n\n' +
        'Your Account name is your email address and the defult initial Password ' +
        'is attached below. You should update your Password after logging in.\n\n' +
        'Account name: youremailaddress@xxx.gmail\n' +
        'Password:\nHiremecoder_2019\n\n' +
        'Please click the link below to login to Hime Me Coder\n\n' +
        '\" THE LINK TO LOGIN TO HIRE ME CODER \"    \n\n' +
        'Best regards,\n' +
        'Hire Me Coder Team'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
