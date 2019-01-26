var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new mongoose.Schema({
  itemName: String,
	itemPrice: Number,
	created: Date,
  requiredLevel: Number,
});

module.exports = mongoose.model('gangitem', questionSchema);
