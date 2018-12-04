var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gangSchema = new mongoose.Schema({
	name: String,
  level: Number,
  welcomeMessage: String,
  balance: Number,
  created: Date,
	leader: String,
  leaderID: String,
  otherMembers: Array,
	membersAmount: Number,
});

module.exports = mongoose.model('gang', gangSchema);
