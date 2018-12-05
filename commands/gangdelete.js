const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');
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
  var user_obj = Gang.findOne({
    leaderID: message.member.id
  }, function (err, foundObj) {
    if (err)
      console.log("Error on database findOne: " + err);
    else {
      if (!foundObj){
        console.log("Something stange happend");
        return message.reply("ты не являешься главарём какой-либо группировки!");
      }
      else {
        var leha = message.guild.members.find("id", "215970433088880641");
        var sema = message.guild.members.find("id", "354261484395560961");
        var bodya = message.guild.members.find("id", "358212316975726603");
        var gangRole = message.guild.roles.find(`name`, foundObj.name);
        message.reply(`ты только что удалил группировку **${foundObj.name}**`);
        leha.sendMessage(`<@${message.member.id}> только что удалил группировку ${foundObj.name}!`);
        sema.sendMessage(`<@${message.member.id}> только что удалил группировку ${foundObj.name}!`);
        bodya.sendMessage(`<@${message.member.id}> только что удалил группировку ${foundObj.name}!`);
        var user_obj = Gang.deleteOne({
          leaderID: message.member.id
        }, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
        });
      }
    }
  });
}

module.exports.help = {
  name: "gangdelete"
}
