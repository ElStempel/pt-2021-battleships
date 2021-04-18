var express = require('express');
var router = express.Router();
var User = require('../models/user')
//var omit = require('object.omit')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('Users routing');
});

// ADD USER
router.post('/add', async function(req, res, next) {
  let user_check = await User.findOne({user_name: req.body.user_name});
  if (user_check) return res.status(400).send("Username taken");
  var user = new User({
    user_name: req.body.user_name,
    pass_hash: req.body.pass_hash
  })
  try {
    await user.save()
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error)
  }
});

// UPDATE USER
router.patch('/update', async function(req, res, next) {
  let user_check = await User.findOne({_id: req.body._id, pass_hash: req.body.pass_hash});
  if (user_check){
    //console.log(user_check)
    user_check.pass_hash = req.body.new_pass_hash;
    try {
      await user_check.save()
      res.status(200).send(user_check);
    } catch (error) {
      res.status(400).send(error)
    }
  } else {
    return res.status(400).send("User doesn't exist");
  }
});

// LOGIN USER
router.post('/login', async function(req, res, next) {
  let user_check = await User.findOne({user_name: req.body.user_name, pass_hash: req.body.pass_hash});
  if (user_check){
    return res.status(200).send(user_check) 
  } else {
    res.status(400).send("User doesn't exist")
  }
});

// LOGOUT USER
router.post('/logout', async function(req, res, next) {
  res.status(200).send('Loging out');
});

// DELETE USER
router.post('/delete', async function(req, res, next) {
  let user_check = await User.deleteOne({ _id: req.body._id, pass_hash: req.body.pass_hash });
  //console.log(user_check.deletedCount)
    if (user_check.deletedCount == 1){
      return res.status(200).send("User deleted") 
    } else {
      res.status(400).send("Bad data")
    }
});

function new_Table(json_table){
  var table = []
  for (var index in json_table){
    table.push({
      'user_name': json_table[index].user_name, 
      'stats': json_table[index].stats, 
      'logged_in': json_table[index].logged_in, 
      'playing': json_table[index].playing})
  }
  return table
}

// LIST USERS
router.get('/list', async function(req, res, next) {
  let all = await User.find()
  let tabela = await new_Table(all)
  res.status(200).send(tabela);
});

module.exports = router;
