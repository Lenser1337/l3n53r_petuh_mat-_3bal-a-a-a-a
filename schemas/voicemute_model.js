var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voicemuteSchema = new mongoose.Schema({
	userID: String,
	userNickname: String,
	vmutedFor: String,
	moderatorID: String,
	moderatorNickname: String,
	when: Date,
	channelID: String,
	channelName: String,
});

module.exports = mongoose.model('voicemute', voicemuteSchema);
