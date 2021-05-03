var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GameSchema = new Schema(
  {
    room: {type: Schema.Types.ObjectId, ref: 'Room'},
    player_1: {type: Schema.Types.ObjectId, ref: 'User'},
    player_2: {type: Schema.Types.ObjectId, ref: 'User'},
    map_size: {type: Number, required: true, default: 10, min: 7, max: 20},
    force_gap: {type: Boolean, required: true, default: false},
    p1_map: {type: Array},
    p2_map: {type: Array},
    p1: {
        attack1: {type: Boolean, default: false},
        attack2: {type: Boolean, default: false},
        attack3: {type: Boolean, default: false},
        ships_sunk: {type: Number, default: 0},
        ships_lost: {type: Number, default: 0},
        shots_fired: {type: Number, default: 0},
    },
    p2: {
        attack1: {type: Boolean, default: false},
        attack2: {type: Boolean, default: false},
        attack3: {type: Boolean, default: false},
        ships_sunk: {type: Number, default: 0},
        ships_lost: {type: Number, default: 0},
        shots_fired: {type: Number, default: 0},
    },
    propose_draw: {type: Number, required: true, default: 0}
  }
);

//Export model
module.exports = mongoose.model('Game', GameSchema);
