var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = new mongoose.Schema({
	roleID: String,
	roleName: String,
	salary: Number,
});

module.exports = mongoose.model('roles', roleSchema);
