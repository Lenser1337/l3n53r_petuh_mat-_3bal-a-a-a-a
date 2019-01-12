var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reportSchema = new mongoose.Schema({
	moder: String,
	moderID: String,
	warnsAmount: Number,
	infractionsAmount: Number,
	muteAmount: Number,
	voicemuteAmount: Number,
	resetedwarns: Number,
	resetedinfractions: Number,
	resetedmutes: Number,
	resetedvoicemutes: Number,
	rebuke: Number,
});

module.exports = mongoose.model('report', reportSchema);
