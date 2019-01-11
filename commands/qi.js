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
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "📲Журналист", "Главный редактор"].includes(r.name)))
    return message.reply("похоже у тебя нехватка прав!").then(msg => msg.delete(10000));
  var questions = await Question.find().sort({createdAt: -1}).limit(1).lean().exec(function(err, doc) {

    var question_obj = doc[0];
    message.channel.send(`^q на последний вопрос прописан ${question_obj.questionTrue} раз!`);
  });
}

  module.exports.help = {
    name: "qi"
  }
