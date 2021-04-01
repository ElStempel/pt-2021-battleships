var express = require('express');
var router = express.Router();

/* GET stats listing. */
router.get('/', function(req, res, next) {
  res.send('Stats routing');
});

router.patch('/update', function(req, res, next) {
  res.send('Updating stats');
});

router.get('/check', function(req, res, next) {
  res.send('Checking stats');
});

module.exports = router;
