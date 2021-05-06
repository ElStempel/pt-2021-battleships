var express = require('express');
var router = express.Router();
var Room = require('../models/room');
var User = require('../models/user');
var Game = require('../models/game');

/* GET games listing. */
router.get('/', function(req, res, next) {
    res.status(200).send('Games routing');
});

//Init-map (game_id, player_id, map[][])
router.patch('/init-map', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.player_1 == req.body.player_id){
            if(req.body.map.length == game.map_size){
                game.p1_map = req.body.map;
                game.maps_ready += 1;
                try {
                    await game.save()
                    res.status(200).send('Map updated');
                } catch (error) {
                    res.status(400).send(error)
                }
            } else {
                res.status(409).send('Inproper map size')
            }
            
        } else if(game.player_2 == req.body.player_id){
            if(req.body.map.length == game.map_size){
                game.p1_map = req.body.map;
                game.maps_ready += 1;
                try {
                    await game.save()
                    res.status(200).send('Map updated');
                } catch (error) {
                    res.status(400).send(error)
                }
            } else {
                res.status(409).send('Inproper map size')
            }

        } else {
            res.status(400).send("This player is not in this game")
        }

    } else {
        res.status(400).send("Game does not exist")
    }
});

function search_and_destroy(enemyMap, ship, map_size){
    var segments;
    switch(ship){
        case 11: segments = 5; break;
        case 21: segments = 4; break;
        case 31: segments = 3; break;
        case 41: segments = 3; break;
        case 51: segments = 2; break;     
    }
    var coordinates = [[]];

    for(var i = 0; i < map_size; i++){
        for(var j = 0; j < map_size; j++){
            if(enemyMap[i][j] == ship){
                coordinates.push([i, j])
            }
        }
    }

    if(coordinates.length == segments){
        for(var i = 0; i < segments; i++){
            enemyMap[coordinates[i][0]][coordinates[i][1]] += 1;
        }
    }

    return enemyMap;
}

//shot (game_id, player_id, coordinates:{x, y})
router.post('/shot', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.player_1 == req.body.player_id){
            if(req.body.coordinates.x >= 0 && req.body.coordinates.x < game.map_size 
                && req.body.coordinates.y >= 0 && req.body.coordinates.y < game.map_size){
                if(parseInt(game.p2_map[x][y]/10) > 0){
                    game.p2_map[x][y]+=1;
                    game.p2_map = await search_and_destroy(game.p2_map, game.p2_map[x][y], game.map_size)
                } else {
                    game.p2_map[x][y]=5;
                    game.turn = 2;
                } 
                try {
                    await game.save()
                    res.status(200).send('Shot registered');
                } catch (error) {
                    res.status(400).send(error)
                }
            } else {
                res.status(409).send('Coordinates out of range')
            }
            
        } else if(game.player_2 == req.body.player_id){
            if(req.body.coordinates.x >= 0 && req.body.coordinates.x < game.map_size 
                && req.body.coordinates.y >= 0 && req.body.coordinates.y < game.map_size){
                if(parseInt(game.p1_map[x][y]/10) > 0){
                    game.p1_map[x][y]+=1;
                    game.p1_map = await search_and_destroy(game.p1_map, game.p1_map[x][y], game.map_size)
                } else {
                    game.p1_map[x][y]=5;
                    game.turn = 1;
                }
                try {
                    await game.save()
                    res.status(200).send('Shot registered');
                } catch (error) {
                    res.status(400).send(error)
                }
            } else {
                res.status(409).send('Coordinates out of range')
            }

        } else {
            res.status(400).send("This player is not in this game")
        }

    } else {
        res.status(400).send("Game does not exist")
    }
});
module.exports = router;