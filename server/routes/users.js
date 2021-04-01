var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Users routing');
});

// ADD USER
router.post('/add', function(req, res, next) {
  res.send('Adding a user');
});

// UPDATE USER
router.patch('/update', function(req, res, next) {
  res.send('Updating a user');
});

// LOGIN USER
router.post('/login', function(req, res, next) {
  res.send('Loging in');
});

// LOGOUT USER
router.post('/logout', function(req, res, next) {
  res.send('Loging out');
});

// DELETE USER
router.post('/delete', function(req, res, next) {
  res.send('Deleting a user');
});

// LIST USERS
router.get('/list', function(req, res, next) {
  res.send('Listing users');
});

module.exports = router;
