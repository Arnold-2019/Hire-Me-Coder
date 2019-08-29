var express = require('express');
var router = express.Router();




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










/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Login page
router.get('/login', function(req, res, next) {
  res.render('login', { layout: false });
});

//Admin page
router.get('/login/admin', function(req, res, next) {
  res.render('admin', { layout: false });
});










module.exports = router;
