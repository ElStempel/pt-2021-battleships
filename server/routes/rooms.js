var express = require('express');
var router = express.Router();
var Room = require('../models/room');
var User = require('../models/user');
var Game = require('../models/game');

/* GET rooms listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('Rooms routing');
});

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

// FETCH GAME
router.post('/fetch-game', async function(req, res, next) {
  let user_in_room_check = await Room.findOne({_id: req.body.room_id, player_2: req.body.player_2_id});
  if(user_in_room_check){
    let game_check = await Game.findOne({room: user_in_room_check});
    if (game_check){
      res.status(200).send(game_check)
    } else {
      res.status(400).send("No game")
    }
  } else {
    res.status(400).send("Bad data")
  }
});

// FETCH END OF GAME
router.post('/fetch-end', async function(req, res, next) {
  let user_in_room_check = await Room.findOne({_id: req.body.room_id, player_2: req.body.player_2_id});
  if(user_in_room_check){
    let game_check = await Game.findOne({room: user_in_room_check});
    if (game_check){
      res.status(400).send("Game is running")
    } else {
      res.status(200).send("Game ended")
    }
  } else {
    res.status(400).send("Bad data")
  }
});

// START A GAME
router.post('/start-game', async function(req, res, next) {
  let user_in_room_check = await Room.findOne({_id: req.body.room_id, player_1: req.body.player_1_id});
  if (user_in_room_check){
    //ważne zmienne
    let size = 10;
    if (user_in_room_check.custom_rules.enabled == true && user_in_room_check.custom_rules.map_size != 10){
      size = user_in_room_check.custom_rules.map_size;
    }
    let f_gap = false;
    if (user_in_room_check.custom_rules.enabled == true && user_in_room_check.custom_rules.cust_rule_4 == true){
      f_gap = true;
    }
    // custom shots
    let shot_1 = false
    let shot_2 = false
    let shot_3 = false
    if (user_in_room_check.custom_rules.enabled == true){
      if (user_in_room_check.custom_rules.cust_rule_1 == true){
        shot_1 = true
      }
      if (user_in_room_check.custom_rules.cust_rule_2 == true){
        shot_2 = true
      }
      if (user_in_room_check.custom_rules.cust_rule_3 == true){
        shot_3 = true
      }
    }
    //populate maps
    let map_1 = Array(size)
    for (var i = 0; i < size; i++){
      map_1[i] = Array(size).fill(0);
    }
    let map_2 = Array(size)
    for (var i = 0; i < size; i++){
      map_2[i] = Array(size).fill(0);
    }
    //gra
    var new_game = new Game({
      room: req.body.room_id,
      player_1: user_in_room_check.player_1,
      player_2: user_in_room_check.player_2,
      map_size: size,
      force_gap: f_gap,
      p1_map: map_1,
      p2_map: map_2,
      p1: {
        attack1: shot_1,
        attack2: shot_2,
        attack3: shot_3
      },
      p2: {
        attack1: shot_1,
        attack2: shot_2,
        attack3: shot_3
      }
    })
    try {
      await new_game.save()
      res.status(201).send(new_game);
    } catch (error) {
      res.status(400).send(error)
    }
  } else {
    return res.status(400).send("Bad data");
  }
});

// END A GAME
router.post('/end-game', async function(req, res, next) {
  let game_to_end = await Game.findOne({_id: req.body.game_id, player_1: req.body.player_1_id});
  if (game_to_end){
    var p1 = await User.findOne({_id: req.body.player_1_id})
    var p2 = await User.findOne({_id: game_to_end.player_1._id})
    if (p1 && p2){
      p1.stats.games_played += 1;
      p1.stats.ships_sunk += game_to_end.p1.ships_sunk;
      p1.stats.ships_lost += game_to_end.p1.ships_lost;
      p1.stats.shots_fired += game_to_end.p1.shots_fired;

      p2.stats.games_played += 1;
      p2.stats.ships_sunk += game_to_end.p2.ships_sunk;
      p2.stats.ships_lost += game_to_end.p2.ships_lost;
      p2.stats.shots_fired += game_to_end.p2.shots_fired;

      try{
        await p1.save()
        await p2.save()
      } catch (error) {
        res.status(400).send(error)
      }
    }
  }
  let game_to_delete = await Game.deleteOne({_id: req.body.game_id, player_1: req.body.player_1_id});
  if(game_to_delete.deletedCount == 1){
    res.status(200).send('Game ended, stats saved')
  } else {
    res.status(400).send('Bad data')
  }
});

module.exports = router;
