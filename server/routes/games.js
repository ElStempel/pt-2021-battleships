var express = require('express');
var router = express.Router();
var Room = require('../models/room');
var User = require('../models/user');
var Game = require('../models/game');
const { findOneAndDelete } = require('../models/game');

//Test games routing
router.get('/', function(req, res, next) {
    res.status(200).send('Games routing');
});

//Init-map (game_id, player_id, map[][])
router.patch('/init-map', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.player_1 == req.body.player_id){
            if(game.p1_ready == false){
                if(req.body.map.length == game.map_size){
                    game.p1_map = req.body.map;
                    game.p1_ready = true;
                    try {
                        await game.save()
                        res.status(200).send('Map updated');
                    } catch (error) {
                        res.status(500).send(error)
                    }
                } else {
                    res.status(409).send('Improper map size')
                }
            } else {
                res.status(405).send("This player has already initialized a map")
            }
            
        } else if(game.player_2 == req.body.player_id){
            if(game.p2_ready == false){
                if(req.body.map.length == game.map_size){
                    game.p2_map = req.body.map;
                    game.p2_ready = true;
                    try {
                        await game.save()
                        res.status(200).send('Map updated');
                    } catch (error) {
                        res.status(500).send(error)
                    }
                } else {
                    res.status(409).send('Improper map size')
                }
            } else {
                res.status(405).send("This player has already initialized a map")
            }

        } else {
            res.status(405).send("This player is not in this game")
        }

    } else {
        res.status(404).send("Game does not exist")
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
    var coordinates = [];

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
        //pass sunken ship to update game stats
        return [enemyMap, true];
    } else {
        return [enemyMap, false];
    }
}

//shot (game_id, player_id, coordinates:{x, y})
router.post('/shot', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.p1_ready == true && game.p2_ready == true){
            if(game.player_1 == req.body.player_id){
                if(game.turn == 1){
                    if(req.body.coordinates.x >= 0 && req.body.coordinates.x < game.map_size 
                        && req.body.coordinates.y >= 0 && req.body.coordinates.y < game.map_size){
                        var x = req.body.coordinates.x;
                        var y = req.body.coordinates.y;
                        if(parseInt(game.p2_map[x][y]/10) > 0){
                            game.p2_map[x][y]+=1;
                            snd_info = await search_and_destroy(game.p2_map, game.p2_map[x][y], game.map_size)
                            game.p2_map = snd_info[0];
                            if(snd_info[1] == true){
                                game.p1.ships_sunk += 1;
                                game.p2.ships_lost += 1;
                                if(game.p1.ships_sunk == 5){
                                    game.winner = 1;
                                }
                            }
                        } else {
                            game.p1.shots_missed += 1;
                            game.p2_map[x][y]=5;
                            game.turn = 2;
                        }
                        game.p1.shots_fired += 1;
                        try {
                            await game.markModified("p2_map")
                            await game.save()
                            res.status(200).send('Shot registered');
                        } catch (error) {
                            res.status(500).send(error)
                        }
                    } else {
                        res.status(409).send('Coordinates out of range')
                    }
                } else {
                    res.status(405).send("This is other player's turn")
                }
            } else if(game.player_2 == req.body.player_id){
                if(game.turn == 2){
                    if(req.body.coordinates.x >= 0 && req.body.coordinates.x < game.map_size 
                        && req.body.coordinates.y >= 0 && req.body.coordinates.y < game.map_size){
                        var x = req.body.coordinates.x;
                        var y = req.body.coordinates.y;
                        if(parseInt(game.p1_map[x][y]/10) > 0){
                            game.p1_map[x][y]+=1;
                            snd_info = await search_and_destroy(game.p1_map, game.p1_map[x][y], game.map_size)
                            game.p1_map = snd_info[0];
                            if(snd_info[1] == true){
                                game.p2.ships_sunk += 1;
                                game.p1.ships_lost += 1;
                                if(game.p2.ships_sunk == 5){
                                    game.winner = 2;
                                }
                            }
                        } else {
                            game.p2.shots_missed += 1;
                            game.p1_map[x][y] = 5;
                            game.turn = 1;
                        }
                        game.p2.shots_fired += 1;
                        try {
                            await game.markModified("p1_map")
                            await game.save()
                            res.status(200).send('Shot registered');
                        } catch (error) {
                            res.status(500).send(error)
                        }
                    } else {
                        res.status(409).send('Coordinates out of range')
                    }
                } else {
                    res.status(405).send("This is other player's turn")
                }
            } else {
                res.status(405).send("This player is not in this game")
            }
        } else {
            res.status(405).send("Players are not ready yet")
        }
    } else {
        res.status(404).send("Game does not exist")
    }
});

router.post('/shot/cluster', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.p1_ready == true && game.p2_ready == true){
            if(game.player_1 == req.body.player_id){
                if(game.turn == 1){
                    if (game.p1.attack2 == true){
                        if(req.body.coordinates.x >= 0 && req.body.coordinates.x < game.map_size 
                            && req.body.coordinates.y >= 0 && req.body.coordinates.y < game.map_size){
                            var x = req.body.coordinates.x;
                            var y = req.body.coordinates.y;
                            if(parseInt(game.p2_map[x][y]/10) > 0){
                                game.p2_map[x][y]+=1;
                                snd_info = await search_and_destroy(game.p2_map, game.p2_map[x][y], game.map_size)
                                game.p2_map = snd_info[0];
                                if(snd_info[1] == true){
                                    game.p1.ships_sunk += 1;
                                    game.p2.ships_lost += 1;
                                    game.turn = 2;
                                    game.p1.attack2 = false
                                    if(game.p1.ships_sunk == 5){
                                        game.winner = 1;
                                    }
                                }
                            } else {
                                game.p1.shots_missed += 1;
                                game.p2_map[x][y]=5;
                            }
                            game.p1.shots_fired += 1;
                            try {
                                await game.markModified("p2_map")
                                await game.save()
                                res.status(200).send('Shot registered');
                            } catch (error) {
                                res.status(500).send(error)
                            }
                        } else {
                            res.status(409).send('Coordinates out of range')
                        }
                    } else {
                        res.status(405).send("Move not available")
                    }
                } else {
                    res.status(405).send("This is other player's turn")
                }
            } else if(game.player_2 == req.body.player_id){
                if(game.turn == 2){
                    if (game.p2.attack2 == true){
                        if(req.body.coordinates.x >= 0 && req.body.coordinates.x < game.map_size 
                            && req.body.coordinates.y >= 0 && req.body.coordinates.y < game.map_size){
                            var x = req.body.coordinates.x;
                            var y = req.body.coordinates.y;
                            if(parseInt(game.p1_map[x][y]/10) > 0){
                                game.p1_map[x][y]+=1;
                                snd_info = await search_and_destroy(game.p1_map, game.p1_map[x][y], game.map_size)
                                game.p1_map = snd_info[0];
                                if(snd_info[1] == true){
                                    game.p2.ships_sunk += 1;
                                    game.p1.ships_lost += 1;
                                    game.turn = 1;
                                    game.p2.attack2 = false
                                    if(game.p2.ships_sunk == 5){
                                        game.winner = 2;
                                    }
                                }
                            } else {
                                game.p2.shots_missed += 1;
                                game.p1_map[x][y] = 5;
                            }
                            game.p2.shots_fired += 1;
                            try {
                                await game.markModified("p1_map")
                                await game.save()
                                res.status(200).send('Shot registered');
                            } catch (error) {
                                res.status(500).send(error)
                            }
                        } else {
                            res.status(409).send('Coordinates out of range')
                        }
                    } else {
                        res.status(405).send("Move not available")
                    }
                } else {
                    res.status(405).send("This is other player's turn")
                }
            } else {
                res.status(405).send("This player is not in this game")
            }
        } else {
            res.status(405).send("Players are not ready yet")
        }
    } else {
        res.status(404).send("Game does not exist")
    }
});

function censoreMap(map, map_size){
    for(var i = 0; i < map_size; i++){
        for(var j = 0; j < map_size; j++){
            map[i][j] = map[i][j]%10
        }
    }
    return map;
}

router.post('/shot/torpedo', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.p1_ready == true && game.p2_ready == true){
            if(game.player_1 == req.body.player_id){
                if(game.turn == 1){
                    if (game.p1.attack1 == true){
                        if(req.body.coordinates.x >= 0 && req.body.coordinates.x < game.map_size){
                            var x = req.body.coordinates.x;
                            for (var y = 0; y < game.map_size; y++){
                                if(parseInt(game.p2_map[x][y]/10) > 0){
                                    game.p2_map[x][y]+=1;
                                    snd_info = await search_and_destroy(game.p2_map, game.p2_map[x][y], game.map_size)
                                    game.p2_map = snd_info[0];
                                    if(snd_info[1] == true){
                                        game.p1.ships_sunk += 1;
                                        game.p2.ships_lost += 1;
                                        if(game.p1.ships_sunk == 5){
                                            game.winner = 1;
                                        }
                                    }
                                } else {
                                    game.p2_map[x][y]=5;
                                }
                            }
                            game.turn = 2;
                            try {
                                game.p1.attack1 = false
                                await game.markModified("p2_map")
                                await game.save()
                                res.status(200).send('Shot registered');
                            } catch (error) {
                                res.status(500).send(error)
                            }
                        } else if(req.body.coordinates.y >= 0 && req.body.coordinates.y < game.map_size){
                            var y = req.body.coordinates.y;
                            for (var x = 0; x < game.map_size; x++){
                                if(parseInt(game.p2_map[x][y]/10) > 0){
                                    game.p2_map[x][y]+=1;
                                    snd_info = await search_and_destroy(game.p2_map, game.p2_map[x][y], game.map_size)
                                    game.p2_map = snd_info[0];
                                    if(snd_info[1] == true){
                                        game.p1.ships_sunk += 1;
                                        game.p2.ships_lost += 1;
                                        if(game.p1.ships_sunk == 5){
                                            game.winner = 1;
                                        }
                                    }
                                } else {
                                    game.p2_map[x][y]=5;
                                }
                            }
                            game.turn = 2;
                            try {
                                game.p1.attack1 = false
                                await game.markModified("p2_map")
                                await game.save()
                                res.status(200).send('Shot registered');
                            } catch (error) {
                                res.status(500).send(error)
                            }
                        } else {
                            res.status(409).send('Coordinates out of range')
                        }
                    } else {
                        res.status(405).send("Move not available")
                    }
                } else {
                    res.status(405).send("This is other player's turn")
                }
            } else if(game.player_2 == req.body.player_id){
                if(game.turn == 2){
                    if (game.p2.attack1 == true){
                        if(req.body.coordinates.x >= 0 && req.body.coordinates.x < game.map_size){
                            var x = req.body.coordinates.x;
                            for (var y = 0; y < game.map_size; y++){
                                if(parseInt(game.p1_map[x][y]/10) > 0){
                                    game.p1_map[x][y]+=1;
                                    snd_info = await search_and_destroy(game.p1_map, game.p1_map[x][y], game.map_size)
                                    game.p1_map = snd_info[0];
                                    if(snd_info[1] == true){
                                        game.p2.ships_sunk += 1;
                                        game.p1.ships_lost += 1;
                                        if(game.p2.ships_sunk == 5){
                                            game.winner = 2;
                                        }
                                    }
                                } else {
                                    game.p1_map[x][y]=5;
                                }
                            }
                            game.turn = 1;
                            try {
                                game.p2.attack1 = false
                                await game.markModified("p1_map")
                                await game.save()
                                res.status(200).send('Shot registered');
                            } catch (error) {
                                res.status(500).send(error)
                            }
                        } else if(req.body.coordinates.y >= 0 && req.body.coordinates.y < game.map_size){
                            var y = req.body.coordinates.y;
                            for (var x = 0; x < game.map_size; x++){
                                if(parseInt(game.p1_map[x][y]/10) > 0){
                                    game.p1_map[x][y]+=1;
                                    snd_info = await search_and_destroy(game.p1_map, game.p1_map[x][y], game.map_size)
                                    game.p1_map = snd_info[0];
                                    if(snd_info[1] == true){
                                        game.p2.ships_sunk += 1;
                                        game.p1.ships_lost += 1;
                                        if(game.p2.ships_sunk == 5){
                                            game.winner = 2;
                                        }
                                    }
                                } else {
                                    game.p1_map[x][y]=5;
                                }
                            }
                            game.turn = 1;
                            try {
                                game.p2.attack1 = false
                                await game.markModified("p1_map")
                                await game.save()
                                res.status(200).send('Shot registered');
                            } catch (error) {
                                res.status(500).send(error)
                            }
                        } else {
                            res.status(409).send('Coordinates out of range')
                        }
                    } else {
                        res.status(405).send("Move not available")
                    }
                } else {
                    res.status(405).send("This is other player's turn")
                }
            } else {
                res.status(405).send("This player is not in this game")
            }
        } else {
            res.status(405).send("Players are not ready yet")
        }
    } else {
        res.status(404).send("Game does not exist")
    }
});

router.post('/shot/airstrike', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.p1_ready == true && game.p2_ready == true){
            if(game.player_1 == req.body.player_id){
                if(game.turn == 1){
                    if(req.body.coordinates.x -1 >= 0 && req.body.coordinates.x +1 < game.map_size 
                        && req.body.coordinates.y -1 >= 0 && req.body.coordinates.y +1 < game.map_size){
                        var x = req.body.coordinates.x;
                        var y = req.body.coordinates.y;
                        for (var x_s = x-1; x_s <= x+1; x_s++){
                            for (var y_s = y-1; y_s <= y+1; y_s++){
                                if(parseInt(game.p2_map[x_s][y_s]/10) > 0){
                                    game.p2_map[x_s][y_s]+=1;
                                    snd_info = await search_and_destroy(game.p2_map, game.p2_map[x_s][y_s], game.map_size)
                                    game.p2_map = snd_info[0];
                                    if(snd_info[1] == true){
                                        game.p1.ships_sunk += 1;
                                        game.p2.ships_lost += 1;
                                        if(game.p1.ships_sunk == 5){
                                            game.winner = 1;
                                        }
                                    }
                                } else {
                                    game.p2_map[x_s][y_s]=5;
                                }
                            }
                        }
                        game.turn = 2;
                        try {
                            game.p1.attack3 = false
                            await game.markModified("p2_map")
                            await game.save()
                            res.status(200).send('Shot registered');
                        } catch (error) {
                            res.status(500).send(error)
                        }
                    } else {
                        res.status(409).send('Coordinates out of range')
                    }
                } else {
                    res.status(405).send("This is other player's turn")
                }
            } else if(game.player_2 == req.body.player_id){
                if(game.turn == 2){
                    if(req.body.coordinates.x -1 >= 0 && req.body.coordinates.x +1 < game.map_size 
                        && req.body.coordinates.y -1 >= 0 && req.body.coordinates.y +1 < game.map_size){
                        var x = req.body.coordinates.x;
                        var y = req.body.coordinates.y;
                        for (var x_s = x-1; x_s <= x+1; x_s++){
                            for (var y_s = y-1; y_s <= y+1; y_s++){
                                if(parseInt(game.p1_map[x_s][y_s]/10) > 0){
                                    game.p1_map[x_s][y_s]+=1;
                                    snd_info = await search_and_destroy(game.p1_map, game.p1_map[x_s][y_s], game.map_size)
                                    game.p1_map = snd_info[0];
                                    if(snd_info[1] == true){
                                        game.p2.ships_sunk += 1;
                                        game.p1.ships_lost += 1;
                                        if(game.p2.ships_sunk == 5){
                                            game.winner = 2;
                                        }
                                    }
                                } else {
                                    game.p1_map[x_s][y_s]=5;
                                }
                            }
                        }
                        game.turn = 1;
                        try {
                            game.p2.attack3 = false
                            await game.markModified("p1_map")
                            await game.save()
                            res.status(200).send('Shot registered');
                        } catch (error) {
                            res.status(500).send(error)
                        }
                    } else {
                        res.status(409).send('Coordinates out of range')
                    }
                } else {
                    res.status(405).send("This is other player's turn")
                }
            } else {
                res.status(405).send("This player is not in this game")
            }
        } else {
            res.status(405).send("Players are not ready yet")
        }
    } else {
        res.status(404).send("Game does not exist")
    }
});

function censoreMap(map, map_size){
    for(var i = 0; i < map_size; i++){
        for(var j = 0; j < map_size; j++){
            map[i][j] = map[i][j]%10
        }
    }
    return map;
}

async function end_game(game){
    if(game.winner != 0 || game.propose_draw == 3){
        if(game.saved == false){
            game.saved = true;
            try{
                await game.save()
            } catch (error) {
                //trudno
            }
            var p1 = await User.findOne({_id: game.player_1._id})
            var p2 = await User.findOne({_id: game.player_2._id})
            if (p1 && p2){
                p1.stats.games_played += 1;
                p1.stats.ships_sunk += game.p1.ships_sunk;
                p1.stats.ships_lost += game.p1.ships_lost;
                p1.stats.shots_fired += game.p1.shots_fired;
                p1.stats.shots_missed += game.p1.shots_missed;

                switch(game.winner){
                    case 0: break;
                    case 1: p1.stats.wins += 1;
                        p2.stats.defeats += 1;
                        break;
                    case 2: p2.stats.wins += 1;
                        p1.stats.defeats += 1;
                        break;
                }

                p2.stats.games_played += 1;
                p2.stats.ships_sunk += game.p2.ships_sunk;
                p2.stats.ships_lost += game.p2.ships_lost;
                p2.stats.shots_fired += game.p2.shots_fired;
                p2.stats.shots_missed += game.p1.shots_missed;
        
                try{
                    await p1.save()
                    await p2.save()
                } catch (error) {
                    //trudno
                }
                await new Promise(r => setTimeout(r, 10000));
                await Game.deleteOne({_id: game._id});
            }
        }
    }
}

//fetch-state (game_id, player_id)
router.post('/fetch-state', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.p1_ready == true && game.p2_ready == true){
            if(game.player_1 == req.body.player_id){
                censoredMap = censoreMap(game.p2_map, game.map_size)
                var data = {
                    player: 1,
                    winner: game.winner,
                    turn: game.turn,
                    stats: game.p1,
                    draw: game.propose_draw,
                    playerMap: game.p1_map,
                    enemyMap: censoredMap
                }
                res.status(200).json(data)
                end_game(game);
            } else if(game.player_2 == req.body.player_id){
                censoredMap = censoreMap(game.p1_map, game.map_size)
                var data = {
                    player: 2,
                    winner: game.winner,
                    turn: game.turn,
                    stats: game.p2,
                    draw: game.propose_draw,
                    playerMap: game.p2_map,
                    enemyMap: censoredMap
                }
                res.status(200).json(data)
                end_game(game);
            } else {
                res.status(405).send("This player is not in this game")
            }
        } else {
            res.status(405).send("Players are not ready yet")
        }
    } else {
        res.status(404).send("Game does not exist")
    }
});

//draw (game_id, player_id)
router.patch('/draw', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.p1_ready == true && game.p2_ready == true){
            if(game.player_1 == req.body.player_id){
                if(game.propose_draw != 1){
                    game.propose_draw += 1;
                    try {
                        await game.save()
                        res.status(200).send("Draw proposed")
                    } catch (error) {
                        res.status(500).send(error)
                    }
                } else {
                    res.status(405).send("Draw is already proposed")
                }
            } else if(game.player_2 == req.body.player_id){
                if(game.propose_draw != 2){
                    game.propose_draw += 2;
                    try {
                        await game.save()
                        res.status(200).send("Draw proposed")
                    } catch (error) {
                        res.status(500).send(error)
                    }
                } else {
                    res.status(405).send("Draw is already proposed")
                }
            } else {
                res.status(405).send("This player is not in this game")
            }
        } else {
            res.status(405).send("Players are not ready yet")
        }
    } else {
        res.status(404).send("Game does not exist")
    }
});

//give-up (game_id, player_id)
router.patch('/give-up', async function(req, res, next) {
    let game = await Game.findOne({_id: req.body.game_id})
    if(game){
        if(game.player_1 == req.body.player_id){
            game.winner = 2
            game.p1_ready = true;
            game.p2_ready = true;
            try {
                await game.save()
                res.status(200).send("Game given up")
            } catch (error) {
                res.status(500).send(error)
            }
        } else if(game.player_2 == req.body.player_id){
            game.winner = 1
            game.p1_ready = true;
            game.p2_ready = true;
            try {
                await game.save()
                res.status(200).send("Game given up")
            } catch (error) {
                res.status(500).send(error)
            }
        } else {
            res.status(405).send("This player is not in this game")
        }
    } else {
        res.status(404).send("Game does not exist")
    }
});
module.exports = router;