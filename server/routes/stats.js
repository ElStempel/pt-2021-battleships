var express = require('express');
var router = express.Router();
var User = require('../models/user')

/* GET stats listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('Stats routing');
});

// UPDATE STATS
router.patch('/update', async function(req, res, next) {
  let user_check = await User.findOne({_id: req.body._id});
  if (user_check){
    //console.log(user_check)
    user_check.stats.games_played += req.body.stats.games_played;
    user_check.stats.ships_sunk += req.body.stats.ships_sunk;
    user_check.stats.ships_lost += req.body.stats.ships_lost;
    user_check.stats.shots_fired += req.body.stats.shots_fired;
    try {
      await user_check.save()
      var table = []
      table.push({
        'user_name': user_check.user_name,
        'stats': user_check.stats
      })
      res.status(200).send(table);
    } catch (error) {
      res.status(400).send(error)
    }
  } else {
    return res.status(400).send("User doesn't exist");
  }
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
  res.status(200).send(tabela);
});

router.post('/mine', async function(req, res, next) {
  let user_check = await User.findOne({_id: req.body._id});
  var table = []
  if (user_check){
    table.push({
      'user_name': user_check.user_name,
      'stats': user_check.stats
    })
    return res.status(200).send(table) 
  } else {
    res.status(400).send("User doesn't exist")
  }
});

module.exports = router;
