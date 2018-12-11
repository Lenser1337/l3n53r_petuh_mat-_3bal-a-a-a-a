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
  var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});
  var questions = await Question.find().sort({infractions: -1}).limit(1).lean().exec(function(err, doc) {});
  var question_obj = questions[0];

  message.reply("question found: " + question_obj.questionText);
  message.reply("answer would be: " + question_obj.expectedAnswer);
  // if (typeof user_obj.leaderOf == 'undefined' || user_obj.leaderOf == null) //нужно проверить совпадает ли user_obj
  //   return message.reply(`разве ты лидер группировки?`);
}

module.exports.help = {
  name: "question"
}
