var express = require('express');
var router = express.Router();



//Login page
router.get('/', function(req, res, next) {
  res.render('login', { layout: false });
});




module.exports = router;



