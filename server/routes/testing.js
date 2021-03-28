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

module.exports = router;
