var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gangSchema = new mongoose.Schema({
	name: String,
  level: Number,
  welcomeMessage: String,
  balance: Number,
  created: Date,
  leaderID: String,
  otherMembers: Array,
});

module.exports = mongoose.model('gang', gangSchema);
