var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Users routing');
});

router.post('/add', function(req, res, next) {
  res.send('Adding a user');
});

router.patch('/update', function(req, res, next) {
  res.send('Updating a user');
});

router.post('/login', function(req, res, next) {
  res.send('Loging in');
});

router.post('/logout', function(req, res, next) {
  res.send('Loging out');
});

router.post('/delete', function(req, res, next) {
  res.send('Deleting a user');
});

router.get('/list', function(req, res, next) {
  res.send('Listing users');
});

module.exports = router;
