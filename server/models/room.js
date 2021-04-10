var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoomSchema = new Schema(
  {
    player_1: {type: Schema.Types.ObjectId, ref: 'User'},
    player_2: {type: Schema.Types.ObjectId, ref: 'User'},
    inv_only: {type: Boolean, required: true, default: false},
    custom_rules: {
        enabled: {type: Boolean, required: true, default: false},
        map_size: {type: Number, required: true, default: 10},
        cust_rule_1: {type: Boolean, required: true, default: false},
        cust_rule_2: {type: Boolean, required: true, default: false},
        cust_rule_3: {type: Boolean, required: true, default: false},
        cust_rule_4: {type: Boolean, required: true, default: false},
    },
  }
);

//Export model
module.exports = mongoose.model('Room', RoomSchema);
