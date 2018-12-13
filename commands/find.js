const Discord = require("discord.js");
const fs = require("fs");

function random(min, max) {
	var result = Math.floor(Math.random() * (max - min + 1)) + min;
	return (result);
}

function isNumeric(value) {
	return /^\d+$/.test(value);
}

// function sendToPn(age, gameName, vchannel, userComment){
//   var pnchannel = message.guild.channels.find(`name`, "👋поиск_напарников");
//
//   const embed = new Discord.RichEmbed()
//   .setTitle(`${message.member.displayName} ищет себе напарника.`)
//   .setColor("#35885C")
//   .addField("Возраст:", age, true)
//   .addField("Игра:", gameName, true)
//   .addField("Голосовая комната:", vchannel, true)
//   .addField("Комментарий:", userComment, true)
//
//   pnchannel.send({embed});
// }

module.exports.run = async (bot, message, args) => {
  message.delete().catch(O_o=>{});
  var filter = m => m.author.id === message.member.id;
  var dmChannel = message.member.createDM().then(function(dmChannel){
    dmChannel.send(`Чтобы найти себе напарника ответь пожалуйста на несколько вопросов.`);
    dmChannel.send(`Сколько тебе лет?`);
    //--------------------------------------------//
    dmChannel.awaitMessages(filter, {
      max: 1,
      time: 300000
    }).then(collected => {
      var age = collected.first().content;
      if (isNumeric(age)) {
        dmChannel.send(`В какую игру ты хочешь играть?`);
        //--------------------------------------------//
        dmChannel.awaitMessages(filter, {
          max: 1,
          time: 300000
        }).then(collected => {
          var game = collected.first().content;
          dmChannel.send(`В каком голосовом канале тебя можно найти?`);
          //--------------------------------------------//
          dmChannel.awaitMessages(filter, {
            max: 1,
            time: 300000
          }).then(collected => {
            var voiceСhannel = collected.first().content;
            //--------------------------------------------//
            dmChannel.send(`Твой комментарий:`);
            dmChannel.awaitMessages(filter, {
              max: 1,
              time: 300000
            }).then(collected => {
              var comment = collected.first().content;

              var pnchannel = message.guild.channels.find(`name`, "👋поиск_напарников");
							var userAvatar = message.member.user.avatarURL;

              const embed = new Discord.RichEmbed()
              .setTitle(`${message.member.displayName} ищет себе напарника.`)
              .setColor("#35885C")
              .addField("Возраст:", age, true)
              .addField("Игра:", game, true)
              .addField("Голосовая комната:", voiceСhannel, true)
              .addField("Комментарий:", comment, true)
              .addField("Ник:", `<@${message.member.id}>`, true)
							.setThumbnail(userAvatar)

              pnchannel.send({embed});
              dmChannel.send(`Твое сообщение отправлено! Жди своих будущих напарников!`);
              //--------------------------------------------//
            }).catch(err => {
              dmChannel.send("Время вышло! Ты не ответил на вопрос 4.");
            });
          }).catch(err => {
            dmChannel.send("Время вышло! Ты не ответил на вопрос 3.");
          });
        }).catch(err => {
          dmChannel.send("Время вышло! Ты не ответил на вопрос 2.");
        });
      }
      else{
        dmChannel.send("Введи число!");
      }
    }).catch(err => {
      dmChannel.send("Время вышло! Ты не ответил на вопрос 1.");
    });
  }).catch(function(error){
    console.log(error);
  });
}

module.exports.help = {
  name: "find"
}
