var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    user_name: {type: String, required: true, maxlength: 50, unique: true},
    pass_hash: {type: String, required: true, maxlength: 60},
    logged_in: {type: Boolean, required: false, default: false},
    playing: {type: Boolean, required: false, default: false},
    token: {type: String, required: false, defualt: null},
    stats: {
        games_played: {type: Number, required: true, default: 0},
        wins: {type: Number, required: true, default: 0},
        defeats: {type: Number, required: true, default: 0},
        ships_sunk: {type: Number, required: true, default: 0},
        ships_lost: {type: Number, required: true, default: 0},
        shots_fired: {type: Number, required: true, default: 0},
        shots_missed: {type: Number, required: true, default: 0},
    },
  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);
