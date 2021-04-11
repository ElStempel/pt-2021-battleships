var express = require('express');
var router = express.Router();
var User = require('../models/user')
var omit = require('object.omit')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Users routing');
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
    res.send(user);
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
      res.send(user_check);
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
    return res.send(user_check) 
  } else {
    res.status(400).send("User doesn't exist")
  }
});

// LOGOUT USER
router.post('/logout', async function(req, res, next) {
  res.send('Loging out');
});

// DELETE USER
router.post('/delete', async function(req, res, next) {
  let user_check = await User.deleteOne({ _id: req.body._id, pass_hash: req.body.pass_hash });
  //console.log(user_check.deletedCount)
    if (user_check.deletedCount == 1){
      return res.send("User deleted") 
    } else {
      res.status(400).send("Bad data")
    }
});

function new_Table(json_table){
  var table = []
  for (var entry in json_table){
    table.push({'user_name': entry.user_name, 'stats': entry.stats})
  }
  return table
}

// LIST USERS
router.get('/list', async function(req, res, next) {
  let all = await User.find()
  //console.log(all)
  let tabela = await new_Table(all)
  //let users = omit(all, ['all._id', 'all.__v', 'all.pass_hash'])
  //let users = []
  // for (user in all){
  //   user_new = await omit(all, [user._id, user._v, user.pass_hash])
  //   users.push()
  // }
  //users.push(omit(user, ['_id', '_v', 'pass_hash']))
  res.send(tabela);
});

module.exports = router;
