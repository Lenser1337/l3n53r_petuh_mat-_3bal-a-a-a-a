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
        let gangRole = message.guild.roles.find(`name`, foundObj.name);
        message.guild.removeRole(gangRole);
        message.reply(`ты только что удалил группировку **${foundObj.name}**`);
        var user_obj = Gang.deleteOne({
          leaderID: message.member.id
        }, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
        });
      }
    }
  });
  var user_obj = User.findOne({
    userID: message.member.id
  }, function (err, foundObj) {
    if (err)
      console.log("Error on database findOne: " + err);
    else {
      if (!foundObj){
        console.log("Something stange happend");
      }
      else{
        foundObj.leaderOf = "";
      }
    }
  });
}

module.exports.help = {
  name: "gangdelete"
}
