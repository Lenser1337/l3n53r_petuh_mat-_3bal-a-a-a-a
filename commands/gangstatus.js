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

module.exports.run = async (bot, message, args) => {
  const gangstatus = args.join(" ");
   if (!gangstatus)
     return message.reply("введите новый статус, пожалуйста!")
   if (gangstatus.length >= 20)
     return message.reply("этот статус слишком длинный!")

     var user_obj = Gang.findOne({
       leaderID: message.member.id
     }, function (err, foundObj) {
       if (err)
         console.log("Error on database findOne: " + err);
       else {
         if (!foundObj){
           console.log("Something stange happend");
           return message.reply("вы не являетесь главарём какой-либо группировки!");
         }
         else {
             foundObj.welcomeMessage = gangstatus;
             message.reply(`вы изменили статус группировки под названием **${foundObj.name}**`);
             foundObj.save(function(err, updatedObj){
 							if(err)
 								console.log(err);
 						});
           }
         }
     });
}

module.exports.help = {
  name: "gangstatus"
}
