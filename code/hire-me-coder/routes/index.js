const express = require('express');
const router = express.Router();
const fb = require('../util/db');
var db = fb.firestore();

router.get('/index', function (req, res, next) {
  res.render('index', {isAdmin: true});
});

router.get('/unauthorised', function (req, res, next) {
  res.render('unauthorised');
});

module.exports = router;
