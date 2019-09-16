var express = require('express');
var router = express.Router();


// const flash = require('express-flash');
// const session = require('express-session');

// // initialise seession middleware - flash-express depends on it
// router.use(session({
//   secret : 'this is my long string',
//   resave: false,
//   saveUninitialized: true
// }));

// //initialise the flash middleware
// router.use(flash());


//Login page
router.get('/', function(req, res, next) {
  res.render('login', { layout: false });
});

router.get('/account', function(req, res, next){
  res.render('account', { layout: false });
});



// var serviceAccount = require('../firebase-service-account-key.json');

// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: 'https://hireme-coder.firebaseio.com'
// });

// Create authentication middleware
// function isAuthenticated(req,res,next){
//   // check if user is logged in
//   firebase.auth().onAuthStateChanged(firebaseUser => {
//     if(firebaseUser) {
//         next();
//     } else {
//         console.log('please logged in');
//         res.render('login', { layout: false });
//     }
// });
// }

// router.get('/check',  isAuthenticated,function(req,res,next) {
//   res.send('check');
// });



module.exports = router;



