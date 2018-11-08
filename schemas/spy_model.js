var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var spySchema = new mongoose.Schema({
	userName: String,
	userID: String,
	date: Date,
	message: String,
	channel: String,
	read: Boolean,
});

module.exports = mongoose.model('spy', spySchema);
