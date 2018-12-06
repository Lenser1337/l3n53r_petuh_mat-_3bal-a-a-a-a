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
   if (!gang)var user_obj = Gang.findOne({
     name: gang
   }, function (err, foundObj) {
     if (err)
       console.log("Error on database findOne: " + err);
     else {
       if (!foundObj)
         console.log("Something stange happend");
       else {
         if (foundObj == null)
           return message.reply("введите название группировки, пожалуйста!")
           else{
             if(foundObj.membersAmount == 0)
               foundObj.membersAmount = 1;
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
                 url: `https://retrobotproject.herokuapp.com/images/gang.jpg`
               }
             }
           });
         }
       }
     }
    });


  var retricIcon = bot.emojis.find("name", "retric");
  var hmmIcon = bot.emojis.find("name", "hmm");
  var zap = bot.emojis.find("name", "zap")

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
          return message.reply("группировка не найдена!");
        else{
          if(foundObj.membersAmount == 0)
            foundObj.membersAmount = 1;
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
              url: `https://retrobotproject.herokuapp.com/images/gang.jpg`
            }
          }
        });
      }
    }
  }
 });
}

module.exports.help = {
  name: "ganginfo"
}
