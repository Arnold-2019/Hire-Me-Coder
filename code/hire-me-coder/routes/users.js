const express = require('express');
const router = express.Router();

var firebase = require('firebase-admin');
var serviceAccount = require('../firebase-service-account-key.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://hireme-coder.firebaseio.com'
});

// var db = firebase.database();
var db = firebase.firestore();

router.get('/manage-users', function (req, res, next) {
  db.collection('users').get()
    .then(function (snapshot) {
      if (snapshot.empty) {
        res.send("NO SERVERS AVAILABLE")
      } else {
        var docs = snapshot.docs.map(doc => doc.data());
        res.render('manage-users', { result: docs });
        // res.send(JSON.stringify({ users: docs }));
      }
    }).catch(function (err) {
      console.log(err);
    });
})

/* GET users listing. */
router.get('/admin-users', function (req, res, next) {
  db.collection('users').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        // console.log(doc.id, '=>', doc.data());
        return
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    })
});

router.post('/register', function (req, res, next) {
  // let firstName = req.param('firstName');
  // let lastName = req.param('lastName');
  // let email = req.param('email');
  // let role = "admin";
  // //TODO: generate random password
  // let password = 'test123';
  let user = req.body.user;


  firebase.auth().createUser({
    email: email,
    password: password,
    displayName: `${firstName} ${lastName}`
  }).then(userRecord => {
    let docRef = db.collection('users').doc(userRecord['uid']);
    docRef.set({ user });
    // user = docRef.set({
    //   firstName: firstName,
    //   lastName: lastName,
    //   role: role,
    //   email: email
    // });
  }).catch(err => {
    console.log('Error fetching user data:', error);
  }).then(function () {
    if (err) {
      res.status(500);
      return next(err);
    } else {
      res.status(200);
    }
  });
});

router.post('/save', function (req, res, next) {
  let firstName = req.body["firstName"];
  let lastName = req.body["lastName"];
  let email = req.body["email"];
  let password = "test123";
  let displayName = lastName + " " + lastName;
  let role = "admin";


  firebase.auth().createUser({
    email: email,
    password: password,
    displayName: displayName
  }).then(userRecord => {
    let docRef = db.collection('users').doc(userRecord['uid']);
    docRef.set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role
    });
  }).catch(err => {
    res.status(500);
    res.render('error', { error: err })
  }).then(function () {
    res.sendStatus(200);
    return next();
  }).catch(err => {
    res.status(500);
    res.render('error', { error: err })
  })
  // res.send(JSON.stringify({ users: req.body}));
})

module.exports = router;