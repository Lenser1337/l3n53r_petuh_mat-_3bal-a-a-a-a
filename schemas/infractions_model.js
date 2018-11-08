var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var warnSchema = new mongoose.Schema({
	infractionType: String,
	infractedID: String,
	userNickname: String,
	infractedBy: String,
	infracterNickname: String,
	when: Date,
	channelID: String,
	channelName: String,
});

module.exports = mongoose.model('infraction', warnSchema);
