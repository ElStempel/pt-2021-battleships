var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add', function(req, res, next) {
  res.send('respond with a resource');
});

router.patch('/update', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/logout', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/delete', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/list', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
