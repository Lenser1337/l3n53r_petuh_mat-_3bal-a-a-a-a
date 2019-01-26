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

          if (foundObj.avatar)
            avatar = foundObj.avatar;

          message.channel.send({embed: {
            color: 3447003,
            icon_url: 'https://retrobotproject.herokuapp.com/images/gang.jpg',
            title: `**Группировка** :zap: **${foundObj.name}**`,
            description: `(**Уровень :** __**${foundObj.level}**__)`,
            fields: [{
                name: `***Описание***`,
                value: `:zap: ${foundObj.welcomeMessage} :zap:`
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

  if (args){
    message.reply("Found some args!");
    if (args[0]){
      message.reply("First arg: " + args[0]);
    }
    if (args[1]){
      message.reply("Second arg: " + args[1]);
    }
    if (args[2]){
      message.reply("Third arg: " + args[2]);
    }
  }

  else{
    message.reply("No args found!");
  }

  //displayInfo(bot, message, gangName);
}

module.exports.help = {
  name: "ganginfo"
}
