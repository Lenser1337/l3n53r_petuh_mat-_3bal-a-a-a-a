const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);

var User = require('./../schemas/user_model.js');
var Moderation = require('./../schemas/report_model.js');
var Infraction = require('./../schemas/infractions_model.js');


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

  message.delete().catch(O_o=>{});

  var moder = message.member;

  var hmmIcon = bot.emojis.find("name", "hmm");

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "⭐Полицейский⭐", "⚡Городской супергерой"].includes(r.name)))
    return;

  var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!user)
    return;
  if(user == message.member)
    return message.reply("эйй... Не нужно себя варнить!")
  if(user.hasPermission("MANAGE_MESSAGES"))
    return message.reply("нее... Такого человека не заварнишь!");

  let cnchannel = message.guild.channels.find(`name`, "👥черный_рынок");
  let pchannel = message.guild.channels.find(`name`, "📌правила");
  let kchannel = message.guild.channels.find(`name`, "📵канализация");
  let pnchannel = message.guild.channels.find(`name`, "👋поиск_напарников");

  message.channel.send(`${user} привет, я смотрю ты тут новенький! Ознакомся пожалуйста с ${pchannel} ${hmmIcon}`);

  var iData = new Infraction({
    infractionType: "new",
    infractedID: user.id,
    userNickname: user.displayName,
    infractedBy: message.member.id,
    infracterNickname: message.member.displayName,
    when: Date.now(),
    channelID: message.channel.id,
    channelName: message.channel.name,
  });

  iData.save()
  .then(item => {
  })
  .catch(err => {
    console.log("Error: " + err);
  });
}

module.exports.help = {
  name: "new"
}
