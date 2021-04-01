var express = require('express');
var router = express.Router();

var testObj = {
  "items": [
    { "id": 1, "content": {"name": "Jabłka",  "price": 2 }},
    { "id": 2, "content": {"name": "Brzoskwinie", "price": 5 }}
  ]
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(testObj);
  console.log(testObj);
});

// TEST BD
router.post('/bd', function(req, res, next) {
  res.send('tu bedzie baza');
});

// TEST SOCKET
router.post('/socket', function(req, res, next) {
  res.send('gniazdko 240V');
});

module.exports = router;
