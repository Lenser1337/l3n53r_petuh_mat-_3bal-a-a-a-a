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

  var fullstr = message.content.substring(message.content.indexOf(" ") + 1);
  var fullstrArray = fullstr.split("|");
  var questionText = fullstrArray[0];
  var answer = fullstrArray[1];

  if (!questionText || !answer)
    return message.reply("придерживайся шаблона вопрос|ответ!");

  //
  message.reply("твой вопрос: " + questionText).then(r => r.delete(60000)).catch(function(error) {console.log(error)});
  message.channel.send("Твой ответ: " + answer).then(r => r.delete(60000)).catch(function(error) {console.log(error)});
  message.channel.send("Все верно? (да/нет)").then(r => r.delete(60000)).catch(function(error) {console.log(error)});

  var filter = m => m.author.id === message.author.id;
  message.channel.awaitMessages(filter, {
    max: 1,
    time: 60000
  }).then(collected => {
    if (collected.first().content == "да" || collected.first().content == "Да" || collected.first().content == "ДА")
      console.log("new question added by" + message.member.displayName);
    else if (collected.first().content == "нет" || collected.first().content == "Нет" || collected.first().content == "НЕТ")
      return message.reply("ну нет так нет, попробуй еще раз!");
    else
      return message.reply("нужно отвечать **да** или **нет**, процесс прерван!");
  }).catch(err => {
    return message.reply("время вышло, вопрос не сохранен!");
  });

  var questionID = random(0, 999999999);

  var newQuestion = new Question({
    questionID: questionID,
    createdAt: Date.now(),
    createdBy: message.member.id,
    questionText: questionText,
    expectedAnswer: answer
  });
  newQuestion.save()
  .then(item => {
    console.log('New item "'+itm+'" added to database');
  })
  .catch(err => {
    console.log("Error on database save: " + err);
  });

  var user_obj = User.findOne({userID: message.member.id}, function(err, found_user){
    if (err)
      console.log("WTF there is an error: " + err);
    else {
      if (!user_obj)
        console.log("User not found");
      else {
        var newBank = found_user.retrocoinBank + 15000;
        found_user.retrocoinBank = newBank;
        found_user.retrocoinTotal = newBank + found_user.retrocoinCash;
        found_user.save(function(err, updatedObj){
          if (err)
            console.log(err);
        });
      }
    }
  });
  message.reply("твой вопрос добавлен в базу, тебе начислено 15,000 ретриков! Теперь публикуй новость, вопрос будет доступен в течении часа.");
}

module.exports.help = {
  name: "qa"
}
