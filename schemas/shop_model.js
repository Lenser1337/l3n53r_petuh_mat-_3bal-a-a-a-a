var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shopSchema = new mongoose.Schema({
	itemName: String,
	itemPrice: Number,
	usable: Boolean,
	sellable: Boolean,
	deletable: Boolean,
	created: Date,
});

module.exports = mongoose.model('shop', shopSchema);
