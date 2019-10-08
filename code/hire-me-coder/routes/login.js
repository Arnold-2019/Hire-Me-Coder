var express = require('express');
var router = express.Router();
var session = require('express-session');
const fb = require('../util/db');


var db = fb.firestore();

//Login page
router.get('/', function (req, res, next) {
  // res.render('login', { layout: false });
  res.render('login');
});

router.get('/account', function (req, res, next) {
  res.render('account', { layout: false });
});

router.post('/authenticate', function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  let userId = req.body['userId'];
  var user;
  db.collection('admin_users')
    .doc(userId)
    .get()
    .then(snapshot => {
      if (!snapshot.exists) {
        user = { userId: userId, isAdmin: false };
        req.session.user = user;
        res.send({
          success: false,
          message: 'not admin'
        });
      } else {
        user = { userId: userId, isAdmin: true };
        req.session.user = user;
        res.send({
          success: true,
          message: 'admin'
        });
      }
    }).catch(err => {
      res.sendStatus(500, { err: err })
    })
});

router.get('/login-success', function (req, res, next) {
  console.log(req.session.user);
  if (req.session.user.isAdmin) {
    res.redirect('/index')
  } else {
    res.redirect('/test/candidate')
  }
})

module.exports = router;



