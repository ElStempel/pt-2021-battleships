var express = require('express');
var router = express.Router();

/* GET rooms listing. */
router.get('/', function(req, res, next) {
  res.send('Rooms routing');
});

// CREATE A ROOM
router.post('/create', function(req, res, next) {
  res.send('Creating a room');
});

// LIST ROOMS
router.get('/list', function(req, res, next) {
  res.send('Listing rooms');
});

// JOIN A ROOM
router.post('/join', function(req, res, next) {
  res.send('Joining a room');
});

// LEAVE A ROOM
router.post('/leave', function(req, res, next) {
  res.send('Leaving a room');
});

// DELETE A ROOM
router.post('/delete', function(req, res, next) {
  res.send('Deleting a room');
});

// INVITE TO A ROOM
router.post('/invite', function(req, res, next) {
  res.send('Inviting to a room');
});

// START A GAME
router.post('/start-game', function(req, res, next) {
  res.send('Starting a game');
});

// END A GAME
router.post('/end-game', function(req, res, next) {
  res.send('Ending the game');
});

module.exports = router;
