var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tempmuteSchema = new mongoose.Schema({
	userID: String,
	userNickname: String,
	tmutedFor: String,
	moderatorID: String,
	moderatorNickname: String,
	when: Date,
	channelID: String,
	channelName: String,
});

module.exports = mongoose.model('tempmute', tempmuteSchema);
