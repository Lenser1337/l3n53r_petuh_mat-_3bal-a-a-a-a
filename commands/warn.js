const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);

var Warn = require('./../schemas/warn_model.js');
var User = require('./../schemas/user_model.js');
var Report = require('./../schemas/report_model.js');

//tempmute @member Time

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

  console.log('warn');
  var wutIcon = bot.emojis.find("name", "wut");

  let reason = "";
  reason = args.join(" ").slice(22);
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  let muterole = message.guild.roles.find(`name`, "Наручники (Мут чата)");
  let mutetime = "";
  let warnchannel = message.guild.channels.find(`name`, "🌘reports_bots");
  let errorschannel = message.guild.channels.find(`name`, "🌏errors_bots");

  if(reason === "")
    return message.reply("укажите причину!");
  if(!message.member.hasPermission("MOVE_MEMBERS"))
    return message.reply("погоди-ка, у тебя нехватка прав :eyes:");
  if(!wUser)
    return message.reply(`пользователь не существует ${wutIcon}`);
  if(wUser.hasPermission("MOVE_MEMBERS"))
    return message.reply(`не, этого дядьку заварнить не получится ${wutIcon}`);
  if(!muterole)
    return errorschannel.send("роль для нарушителей не найдена!");
  if(!errorschannel)
    return message.channel.send("Канал ошибок не существует!");
  if(!warnchannel)
    errorschannel.send("Канал репортов не существует!");
  if(!warnchannel)
    return message.channel.send("Канал репортов не существует!");

  var myData = new Warn({
    userID: wUser.id,
    userNickname: wUser.displayName,
    warnedFor: reason,
    moderatorID: message.member.id,
    moderatorNickname: message.member.displayName,
    when: Date.now(),
    channelID: message.channel.id,
    channelName: message.channel.name,
    warnedVia: "RetroBot"
  });

  myData.save()
  .then(item => {
  })
  .catch(err => {
    console.log("Error: " + err);
  });

  let moder = message.member;
  var user_obj = Report.findOne({
  	moderID: moder.id
  }, function (err, foundObj) {
  	if (err)
  		console.log("Error on database findOne: " + err);
  	else {
  		if (foundObj === null){
  			var myData = new Report({
  				moder: moder.username,
  				moderID: moder.id,
          infractionsAmount: 0,
          warnsAmount: 1,
          muteAmount: 0,
          voicemuteAmount: 0,
  			});
  			myData.save()
  			.then(item => {
  			})
  			.catch(err => {
  				console.log("Error on database save: " + err);
  			});
  		} else {
        if (!foundObj)
          return console.log("Something stange happend");
        var newWarnsAmount = foundObj.warnsAmount + 1;
        foundObj.warnsAmount = newWarnsAmount;
        foundObj.save(function(err, updatedObj){
          if(err)
            console.log(err);
        });
    	}
    }
  });

  var user_obj = User.findOne({
    userID: wUser.id
  }, async function (err, foundObj) {
    if (err)
      console.log("Error on database findOne: " + err);
    else {
      if (!foundObj)
        console.log("Something stange happend");
      else {
        var actInfractions = foundObj.infractions;
        var newInfractions = actInfractions + 1;

        foundObj.infractions = newInfractions;
        foundObj.save(function(err, updatedObj){
          if(err)
            console.log(err);
        });

        let sicon = message.guild.iconURL;

        const embed = new Discord.RichEmbed()
        .setTitle(":star: Отчет о варне :star:")
        .setColor("#fc6400")
        .addField("Жертва", `<@${wUser.id}>`, true)
        .addField("Предупреждение выдано в", message.channel, true)
        .addField("Предупреждение выдал", message.member, true)
        .addField("Предупреждений у нарушителя", newInfractions, true)
        .addField(`Время выдачи варна:`, formatDate(new Date()), true)
        .addField("Причина", reason, true);

        warnchannel.send({embed});

        if(newInfractions == 1){
          message.channel.send(`<@${wUser.id}>` + " получил свое первое предупреждение! Не нарушай больше!");
        }
        else{
        switch (newInfractions) {
          case 2:
            mutetime = "5m";
            break;
          case 3:
            mutetime = "10m";
          case 4:
            mutetime = "20m";
          default:
            mutetime = "30m";
        }

        var user_obj = User.findOne({
          userID: wUser.id
        }, function (err, foundObj) {

        var timestamp = new Date().getTime();
        var mutedUntil = new Date();

        mutedUntil.setTime(timestamp + ms(mutetime));

        foundObj.mutedUntil = mutedUntil;
        foundObj.save(function(err, updatedObj){
          if(err)
            console.log(err);
          });
        });
        wUser.addRole(muterole.id);
        message.channel.send(`<@${wUser.id}>` + " посидит " + mutetime + ",  подумает...");
       }
     }
    }
  });
}

module.exports.help = {
  name: "warn"
}
