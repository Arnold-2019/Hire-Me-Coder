const express = require('express');
const router = express.Router();

// var firebase = require('firebase-admin');
// var serviceAccount = require('../firebase-service-account-key.json');

// firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount),
//     databaseURL: 'https://hireme-coder.firebaseio.com'
//   });

// var db = firebase.firestore();
router.get('/', function (req, res, next) {
    res.render('login');
});

router.get('/validate', function (req, res, next) {
    
})

module.exports = router;