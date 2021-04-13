var express = require('express');
var router = express.Router();
var Room = require('../models/room');
var User = require('../models/user');

/* GET rooms listing. */
router.get('/', function(req, res, next) {
  res.send('Rooms routing');
});

// CREATE A ROOM

//    custom_rules:{
//         enabled: {type: Boolean, required: true, default: false},
//         map_size: {type: Number, required: true, default: 10},
//         cust_rule_1: {type: Boolean, required: true, default: false},
//         cust_rule_2: {type: Boolean, required: true, default: false},
//         cust_rule_3: {type: Boolean, required: true, default: false},
//         cust_rule_4: {type: Boolean, required: true, default: false}}

router.post('/create', async function(req, res, next) {
  let user_check = await User.findOne({_id: req.body.player_1_id});
  let user_in_room_check = await Room.findOne({player_1: req.body.player_1_id});
  if (user_check && !user_in_room_check){
    var new_room = new Room({
      player_1: req.body.player_1_id,
      player_2: null,
      inv_only: req.body.inv_only,
      custom_rules: req.body.custom_rules,
    })
    try {
      await new_room.save()
      res.status(201).send(new_room);
    } catch (error) {
      res.status(400).send(error)
    }
  } else {
    if(user_in_room_check)
    {
      return res.status(400).send("User already in room");
    } else {
      return res.status(400).send("User doesn't exist");
    }
  }
});

function new_roms_list(json_table){
  var table = []
  for (var index in json_table){
    if(json_table[index].player_2 != null)
    {
      table.push({
        'player_1': json_table[index].player_1.user_name,
        'player_2': json_table[index].player_2.user_name,
        'inv_only': json_table[index].inv_only,
        'custom_rules': json_table[index].custom_rules, 
        '_id': json_table[index]._id})
    } else {
      table.push({
        'player_1': json_table[index].player_1.user_name,
        'player_2': json_table[index].player_2,
        'inv_only': json_table[index].inv_only,
        'custom_rules': json_table[index].custom_rules, 
        '_id': json_table[index]._id})
    }
  }
  return table
}

// LIST ROOMS
router.get('/list', async function(req, res, next) {
  let all = await Room.find()
  for (var i in all){
    all[i].player_1 = await User.findOne({_id: all[i].player_1}, {user_name: true});
    all[i].player_2 = await User.findOne({_id: all[i].player_2}, {user_name: true});
  }
  var rooms_list = new_roms_list(all)
  res.status(200).send(rooms_list);
});

// JOIN A ROOM
router.post('/join', async function(req, res, next) {
  let user_check = await User.findOne({_id: req.body.player_2_id});
  let space_in_room = await Room.findOne({_id: req.body.room_id, player_2: null});
  if (user_check && space_in_room){
    space_in_room.player_2 = req.body.player_2_id;
    try {
      await space_in_room.save()
      res.status(201).send(space_in_room);
    } catch (error) {
      res.status(400).send(error)
    }
  } else {
    if(!space_in_room)
    {
      return res.status(400).send("Room is full");
    } else {
      return res.status(400).send("User doesn't exist");
    }
  }
});

// LEAVE A ROOM
router.post('/leave', async function(req, res, next) {
  let room_to_leave = await Room.findOne({ _id: req.body.room_id, player_2: req.body.player_2_id });
  if(room_to_leave){
    room_to_leave.player_2 = null;
    try {
      await room_to_leave.save()
      res.status(200).send("Room left");
    } catch (error) {
      res.status(400).send(error)
    }
  } else {
    res.status(400).send('Bad data')
  }
});

// DELETE A ROOM
router.post('/delete', async function(req, res, next) {
  let room_to_delete = await Room.deleteOne({ _id: req.body.room_id, player_1: req.body.owner_id });
  if(room_to_delete.deletedCount == 1){
    res.status(200).send('Room deleted')
  } else {
    res.status(400).send('Bad data')
  }
});

// INVITE TO A ROOM
router.post('/invite', async function(req, res, next) {
  res.send('Inviting to a room');
});

// START A GAME
router.post('/start-game', async function(req, res, next) {
  res.send('Starting a game');
});

// END A GAME
router.post('/end-game', async function(req, res, next) {
  res.send('Ending the game');
});

module.exports = router;
