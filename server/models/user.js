var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    user_name: {type: String, required: true, maxlength: 50},
    pass_hash: {type: String, required: true, maxlength: 50},
    stats: {
        games_played: {type: Number, required: true, default: 0},
        win_ratio: {type: Number},
        ships_sunk: {type: Number, required: true, default: 0},
        ships_lost: {type: Number, required: true, default: 0},
        shots_fired: {type: Number, required: true, default: 0},
        hit_ratio: {type: Number},
    },
  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);
