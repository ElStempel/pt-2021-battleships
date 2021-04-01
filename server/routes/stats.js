var express = require('express');
var router = express.Router();

/* GET stats listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.patch('/update', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/check', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
