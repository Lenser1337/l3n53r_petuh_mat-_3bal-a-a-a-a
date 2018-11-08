const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var Warn = require('./../schemas/warn_model.js');
var Report = require('./../schemas/report_model.js');
var User = require('./../schemas/user_model.js');

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

  let reason = "";
  reason = args.join(" ").slice(22);
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  let muterole = message.guild.roles.find(`name`, "Наручники (Мут чата)");
  let mutetime = "";
  let warnchannel = message.guild.channels.find(`name`, "🌘reports_bots");
  let errorschannel = message.guild.channels.find(`name`, "🌏errors_bots");

  let sicon = message.guild.iconURL;

  const embed = new Discord.RichEmbed()
  .setTitle(":star: Отчет о варне (подслушка с Бибо) :star:")
  .setColor("#fc6400")
  .addField("Нарушитель", `<@${wUser.id}>`, true)
  .addField("Предупреждение выдано в", message.channel, true)
  .addField("Предупреждение выдал", message.member, true)
  .addField(`Время выдачи варна:`, formatDate(new Date()), true)
  .addField("Причина", reason, true);

  if(warnchannel){
    warnchannel.send({embed});
  } else {
    console.log("No warnchannel defined");
  }

  var myData = new Warn({
    userID: wUser.id,
    userNickname: wUser.displayName,
    warnedFor: reason,
    moderatorID: message.member.id,
    moderatorNickname: message.member.displayName,
    when: Date.now(),
    channelID: message.channel.id,
    channelName: message.channel.name,
    warnedVia: "MEE6"
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
  			var myData = new User({
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

        foundObj.warnsAmount = foundObj.warnsAmount + 1;
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
        foundObj.infractions = foundObj.infractions + 1;
        foundObj.save(function(err, updatedObj){
          if(err)
            console.log(err);
        });
      }
    }
  });
}

module.exports.help = {
  name: "warn2"
}
