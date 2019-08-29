var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var firebase = require('firebase');

var login = express();


//EJS layout
login.use(expressLayouts);
login.set('view engine', 'ejs');

//Routes
login.use('/users', require('../routes/users'));



// // Admin login
// var admin = require('firebase-admin')
// var serviceAccount = require('./sep-2019-pg5-39ccb-firebase-adminsdk-yivcu-073cc6edb0.json')
// var firebaseAdmin = admin.initializeApp({
//   credential:admin.credential.cert(serviceAccount),
//   databaseURL: 'https://sep-2019-pg5-39ccb.firebaseio.com'
// });





var PORT = process.env.PORT || 5000;

login.listen(PORT, console.log(`Server started on port ${PORT}`));

