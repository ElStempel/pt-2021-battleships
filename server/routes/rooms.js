var express = require('express');
var router = express.Router();

/* GET rooms listing. */
router.get('/', function(req, res, next) {
  res.send('Rooms routing');
});

router.post('/create', function(req, res, next) {
  res.send('Creating a room');
});

router.get('/list', function(req, res, next) {
  res.send('Listing rooms');
});

router.post('/join', function(req, res, next) {
  res.send('Joining a room');
});

router.post('/leave', function(req, res, next) {
  res.send('Leaving a room');
});

router.post('/delete', function(req, res, next) {
  res.send('Deleting a room');
});

router.post('/invite', function(req, res, next) {
  res.send('Inviting to a room');
});

router.post('/start-game', function(req, res, next) {
  res.send('Starting a game');
});

router.post('/end-game', function(req, res, next) {
  res.send('Ending the game');
});

module.exports = router;
