var express = require('express');
var router = express.Router();
var User = require('../models/user')

/* GET stats listing. */
router.get('/', function(req, res, next) {
  res.send('Stats routing');
});

// UPDATE STATS
router.patch('/update', async function(req, res, next) {
  res.send('Updating stats');
});

function new_Table(json_table){
  var table = []
  for (var index in json_table){
    table.push({
      'user_name': json_table[index].user_name, 
      'stats': json_table[index].stats})
  }
  return table
}

// CHECK STATS
router.get('/check', async function(req, res, next) {
  let all = await User.find()
  let tabela = await new_Table(all)
  res.send(tabela);
});

router.post('/mine', async function(req, res, next) {
  let user_check = await User.findOne({_id: req.body._id});
  var table = []
  if (user_check){
    table.push({
      'user_name': user_check.user_name,
      'stats': user_check.stats
    })
    return res.send(table) 
  } else {
    res.status(400).send("User doesn't exist")
  }
});

module.exports = router;
