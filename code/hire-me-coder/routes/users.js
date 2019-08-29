var express = require('express');
var router = express.Router();

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
  res.send('admin');
});


module.exports = router;



