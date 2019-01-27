const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var Gang = require('./../schemas/gang_model.js');
var User = require('./../schemas/user_model.js');

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(date) {
  var monthNames = [
    "января", "февраля", "марта",
    "апреля", "мая", "июня", "июля",
    "августа", "сентября", "октября",
    "ноября", "декабря"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var time = hour + ":" + minute + ":" + second;

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ', ' + time;
}

function displayInfo(bot, message, gangName){

  var retricIcon = bot.emojis.find("name", "retric");
  var hmmIcon = bot.emojis.find("name", "hmm");

  var gang_obj = Gang.findOne({
    name: gangName
  }, function (err, foundObj) {
    if (err)
      console.log("Error on database findOne: " + err);
    else {
      if (!foundObj){
        console.log("Something stange happend");
        return message.reply("группировка не найдена!");
      }
      else {
        if(foundObj.membersAmount == 0)
          foundObj.membersAmount = 1;

        var avatar = "https://retrobotproject.herokuapp.com/images/gang.jpg";

        // if (typeof foundObj.avatar !== 'undefined' && foundObj.avatar !== null){
        //   avatar = foundObj.avatar;
        //   console.log("avatar found!");
        // }

        // var color = message.member.highestRole.color;

        console.log("Color must be: " + color);

        message.channel.send({embed: {
          color: 12345,
          icon_url: avatar,
          title: `**Группировка** :zap: **${foundObj.name}**`,
          description: `(**Уровень :** __**${foundObj.level}**__)`,
          fields: [{
            name: `***Описание***`,
            value: `${foundObj.welcomeMessage}`
          },
          {
            name: `***Баланс группировки : *** ${numberWithCommas(foundObj.balance)} ${retricIcon}`,
            value: `__**Создана**__ : ${formatDate(foundObj.created)}`
          },
          {
            name: `***Участников: *** ${foundObj.membersAmount}`,
            value: `***Лидер: *** <@${foundObj.leaderID}>`
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: message.author.avatarURL,
          text: `© ${message.member.displayName}`
        },
        thumbnail: {
          url: avatar
        }
      }
    });
  }
}
});
}

module.exports.run = async (bot, message, args) => {
  if (args[0]){
    //the user entered some text, have to check if there is a gang with this name
    var gang_obj = await Gang.findOne({leaderID: message.member.id}, function(err, found_gang){});
    if (typeof gang_obj !== 'undefined' && gang_obj !== null)
      displayInfo(bot, message, args[0]);
    else
      message.reply("хммм, такой группировки не существует... Ты точно не ошибся в названии?");
  }
  else{
    //the user entered nothing, have to check if he is a member is a gang
    var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});
    if (typeof user_obj.gang !== 'undefined' && user_obj.gang !== null){
      displayInfo(bot, message, user_obj.gang);
    }
    else
      message.reply("хммм, ты разве состоишь в группировке?");
  }
}

module.exports.help = {
  name: "ganginfo"
}
