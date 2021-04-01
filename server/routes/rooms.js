var express = require('express');
var router = express.Router();

/* GET rooms listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/list', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/join', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/leave', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/delete', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/invite', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/start-game', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/end-game', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
