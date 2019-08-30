var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var firebase = require('firebase');
var logger = require('morgan')

var login = express();



//EJS layout
login.use(expressLayouts);
login.set('view engine', 'ejs');

login.use(express.static('views'))

//Routes
login.use('/login', require('./routes/login'));



// // Admin login
// var admin = require('firebase-admin')
// var serviceAccount = require('./sep-2019-pg5-39ccb-firebase-adminsdk-yivcu-073cc6edb0.json')
// var firebaseAdmin = admin.initializeApp({
//   credential:admin.credential.cert(serviceAccount),
//   databaseURL: 'https://sep-2019-pg5-39ccb.firebaseio.com'
// });



// // Create authentication.middleware
// const isAuthenticated = (req, res, next) => {
//   // check if user is logged in
//   // if they are, attach them to the request and call next
//   // if not, send to the login page with a message"login"
//   let idToken;
//   if(req.hearders.authorization && req.headers.authorization.startsWith('Bearer ')){
//     return next();
//     // idToken = req.hearders.authorization.split('Bearer ')[1];
//   } else {
//     console.error('No token found')
//     return res.status(403).json({ error: 'Unauthorized'});
//   }

  // admin.auth().verifyIdToken(idToken)
  //   .then(decodedToken => {
  //     req.user = decodedToken;
  //     return firebase.collection('users')
  //       .where('userId', '==', req.user.uid)
  //       .limit(1)
  //       .get();
  //   })
  //   .then(data => {
  //     req.user.handle = data.docs[0].data().handle;
  //     return next();
  //   })
// }




var PORT = process.env.PORT || 8080;

login.listen(PORT, console.log(`Server started on port ${PORT}`));

