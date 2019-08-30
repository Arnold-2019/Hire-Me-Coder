var express = require('express');
var router = express.Router();

var firebase = require('firebase-admin');
var serviceAccount = require('../firebase-service-account-key.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://hireme-coder.firebaseio.com'
});

// var db = firebase.database();
var db = firebase.firestore();

router.get('/', function (req, res, next) {
  res.send("Hello World");
})

/* GET users listing. */
router.get('/add-users', function(req, res, next) {
  res.render('users');
  db.collection('users').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
});

router.post('/add-users', function (req, res, next) {
  let firstName = req.param('firstName');
  let lastName = req.param('lastName');
  let email = req.param('email');

  let role = "admin";

  console.log('firstName:' +  firstName);

  console.log('this is add user function');
  let docRef = db.collection('users').doc();
  let user = docRef.set({
    firstName: firstName,
    lastName: lastName,
    role: role,
    email: email
  });

  return Promise.all([user]);

  
});

module.exports = router;
