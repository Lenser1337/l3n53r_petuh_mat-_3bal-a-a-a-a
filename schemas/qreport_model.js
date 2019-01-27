var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reportSchema = new mongoose.Schema({
	user: String,
	userID: String,
	q: Number,
	resetedq: Number,
});

module.exports = mongoose.model('qreport', reportSchema);
