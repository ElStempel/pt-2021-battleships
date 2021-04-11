var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    user_name: {type: String, required: true, maxlength: 50, unique: true},
    pass_hash: {type: String, required: true, maxlength: 50},
    logged_in: {type: Boolean, required: false, default: false},
    playing: {type: Boolean, required: false, default: false},
    token: {type: String, required: false, defualt: null},
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
