const express = require('express');
const router = express.Router();
const fb = require('../util/db');

var db = fb.firestore();

router.get('/manage-users', function (req, res, next) {
  db.collection('admin_users').get()
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
  let firstName = req.param('firstName');
  let lastName = req.param('lastName');
  let email = req.param('email');
  let role = "admin";
  //TODO: generate random password
  let password = 'test123';
  let user = req.body.user;


  fb.auth().createUser({
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
  
  fb.auth().createUser({
    email: email,
    password: password,
    displayName: displayName
  }).then(userRecord => {
    let docRef = db.collection('admin_users').doc(userRecord['uid']);
    docRef.set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      isActive: true
    }).then(function () {
      // res.send(JSON.stringify({ users: req.body }));
      res.sendStatus(200);
      return next();
    }).catch(err => {
      res.status(500);
      res.render('error', { error: err })
    })
  }).catch(err => {
    res.status(500);
    res.render('error', { error: err });
  })
})

router.post('/set-status', function (req, res, next) {

  var email = req.body['email'];
  let status = req.body['status'];
  let isActive;
  console.log(status);

  if (status == '0') {
    isActive = false;
  } else {
    isActive = true;
  }

  let adminUsersRef = db.collection('admin_users');
  let query = adminUsersRef.where('email', '==', email).get().then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    snapshot.forEach(doc => {
      adminUsersRef.doc(doc.id).update({
        isActive: isActive
      }).then(function () {
        res.sendStatus(200);

      });
    });
  }).catch(err => {
    console.log('Error getting documents', err);
    res.sendStatus(500);
  });
});

router.post('/update', function (req, res, next) {
  let firstName = req.body['firstName'];
  let lastName = req.body['lastName'];
  let email = req.body['email'];
  console.log(firstName);
  console.log(lastName);
  console.log(email);

  let adminUsersRef = db.collection('admin_users');
  let query = adminUsersRef.where('email', '==', email).get().then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    snapshot.forEach(doc => {
      adminUsersRef.doc(doc.id).update({
        firstName: firstName,
        lastName: lastName
      }).then(function () {
        res.sendStatus(200);
      });
    });
  }).catch(err => {
    console.log('Error getting documents', err);
    res.sendStatus(500);
  });
});

module.exports = router;