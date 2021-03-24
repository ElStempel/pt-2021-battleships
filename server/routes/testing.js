var express = require('express');
var router = express.Router();

var testObj = { Nazwa: "Test", Liczba: 42, Obiekt: {SubNazwa: "DrugiTest", Liczba: 21.37} };

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(testObj);
  console.log(testObj);
});

module.exports = router;
