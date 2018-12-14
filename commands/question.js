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

function makeMagic(bot, message, qID){
  var user_obj = User.findOne({userID: message.member.id}, function(err, found_user){
    if (err)
      console.log("WTF there is an error: " + err);
    else {
      if (!user_obj)
        console.log("User not found");
      else {
				console.log(found_user.retrocoinBank + ", " + qID)
				var newBank = found_user.retrocoinBank + 5000;
				console.log(newBank);
				found_user.retrocoinBank = newBank;
        found_user.lastQuestionAnswered = qID;
        found_user.save(function(err, updatedObj){
          if (err)
            console.log(err);
        });
      }
    }
  });
}

module.exports.run = async (bot, message, args) => {
  message.delete().catch(O_o=>{});
  var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});
  var questions = await Question.find().sort({createdAt: -1}).limit(1).lean().exec(function(err, doc) {

    var question_obj = doc[0];

    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime/1000);
    var timestampLimit = Math.floor(question_obj.createdAt/1000) + (60 * 60);

    if (timestampLimit < timestamp)
      return message.reply("похоже свежих вопросов нету, попробуй позже!").then(msg => msg.delete(5000));

    if (question_obj.questionID == user_obj.lastQuestionAnswered){
      return message.reply("ты уже отвечал на нынешний вопрос, попробуй позже!").then(msg => msg.delete(5000));
    }

    var dmChannel = message.member.createDM().then(function(dmChannel){
      dmChannel.send(`Привет, ${message.member.displayName}! Проверим как ты читаешь последние новости игрового мира на Retro Valley!`);
      dmChannel.send("Вопрос: " + question_obj.questionText);

      var filter = m => m.author.id === message.member.id;
      dmChannel.awaitMessages(filter, {
        max: 1,
        time: 60000
      }).then(collected => {
        if (collected.first().content.toUpperCase() == question_obj.expectedAnswer.toUpperCase()) {
          dmChannel.send("Верно!");
          makeMagic(bot, message, question_obj.questionID);
        }
        else{
          dmChannel.send("Ээээм... Не-а!");
        }
      }).catch(err => {
        dmChannel.send("время вышло!");
      });
    }).catch(function(error){
      console.log(error);
    });
  });
}

module.exports.help = {
  name: "question"
}
