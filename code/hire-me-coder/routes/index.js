const express = require('express');
const router = express.Router();



// app.use('/users', usersRouter);

// /* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index');
});

module.exports = router;
