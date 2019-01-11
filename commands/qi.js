const Discord = require("discord.js");
const fs = require("fs");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');
var Question = require('./../schemas/question_model.js');

function random(min, max) {
	var result = Math.floor(Math.random() * (max - min + 1)) + min;
	return (result);
}

module.exports.run = async (bot, message, args) => {
  var questions = await Question.find().sort({createdAt: -1}).limit(1).lean().exec(function(err, doc) {

    var question_obj = doc[0];
    message.channel.send(`Правильных ответов: ${question_obj.questionTrue}`);
  });
}

  module.exports.help = {
    name: "q"
  }
