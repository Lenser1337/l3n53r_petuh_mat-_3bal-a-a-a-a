var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new mongoose.Schema({
	questionID: Number,
  createdAt: Date,
  createdBy: String,
  questionText: String,
  expectedAnswer: String,
	questionTrue: Number,
});

module.exports = mongoose.model('questions', questionSchema);
