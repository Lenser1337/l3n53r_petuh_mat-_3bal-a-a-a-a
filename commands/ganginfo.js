const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var Gang = require('./../schemas/gang_model.js');

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

module.exports.run = async (bot, message, args) => {
  const gang = args.join(" ");
   if (!gang)
     return message.reply("введите название группировки, пожалуйста!")

  var user_obj = Gang.findOne({
    name: gang
  }, function (err, foundObj) {
    if (err)
      console.log("Error on database findOne: " + err);
    else {
      if (!foundObj)
        console.log("Something stange happend");
      else {
        if (foundObj == null)
          return messae=ge.reply("группировка не найдена!");
        else{
          message.channel.send({embed: {
            color: 3447003,
            icon_url: 'https://retrobotproject.herokuapp.com/images/gang.jpg',
            title: `**Группировка** :zap: **${gang}**`,
            description: `(**Уровень :** __**${foundObj.level}**__)`,
            fields: [
              {
                name: `***Приветствие***`,
                value: `${foundObj.welcomeMessage}`
              },
              {
                name: `***Баланс группировки : *** ${numberWithCommas(foundObj.balance)} ${retricIcon}`,
                value: `__**Создана**__ : ${formatDate(foundObj.created)}`
              },
              {
                name: `***Лидер: *** <@${foundObj.leaderID}>`,
                value: `***Участники: *** ${foundObj.otherMembers}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: message.author.avatarURL,
              text: `© ${message.member.displayName}`
            },
            thumbnail: {
              url: `${message.member.user.avatarURL}`
            }
          }
        }).then(msg => msg.delete(10000));
      }
    }
  }
 });
}

module.exports.help = {
  name: "ganginfo"
}
