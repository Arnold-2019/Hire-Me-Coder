var express = require('express');
var router = express.Router();
var firebase = require('firebase');




//test page
router.get('/', function(req, res, next) {
  res.send('test');
});

router.get('/create-test', function(req, res, next){
  res.render('create-test', { layout: false });
});

router.get('/manage-test', function(req, res, next){
  res.render('manage-test', { layout: false });
});





module.exports = router;