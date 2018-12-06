const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
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
  const newleader = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
   if (!newleader)
     return message.reply("вы не указали кто станет лидером!");

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
           var gangName = foundObj.name;
         }
       }
     });

     var user_obj = Gang.findOne({
       leaderID: newleader.id
     }, function (err, foundObj) {
       if (err)
         console.log("Error on database findOne: " + err);
       else {
         if (!foundObj)
           console.log("Something stange happend");
         else {
           if (foundObj !== null)
             return message.reply("этот человек уже является лидером другой группировки!");
           }
         }
     });

     var user_obj = User.findOne({
        userID: newleader.id
     }, function (err, foundObj) {
       if (err)
         console.log("Error on database findOne: " + err);
       else {
         if (!foundObj)
           console.log("Something stange happend");
         else {
           if (gang !== undefined && gang !== gangName)
             return message.reply("этот человек уже является участником другой группировки!");
           }
         }
     });

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
             foundObj.leader = newleader;
             foundObj.leaderID = newleader.id;
             foundObj.save(function(err, updatedObj){
 							if(err)
 								console.log(err);
 						})
             message.channel.send(`<@${newleader.id}> стал главарём группировки под названием **${foundObj.name}**!`);
           }
         }
     });

     var user_obj = User.findOne({
        userID: newleader.id
     }, function (err, foundObj) {
       if (err)
         console.log("Error on database findOne: " + err);
       else {
         foundObj.leaderOf = gangName;
         foundObj.save(function(err, updatedObj){
          if(err)
            console.log(err);
        })
      }
    });

    var user_obj = User.findOne({
       userID: message.member.id
    }, function (err, foundObj) {
      if (err)
        console.log("Error on database findOne: " + err);
      else {
        foundObj.leaderOf = undefined;
        foundObj.save(function(err, updatedObj){
         if(err)
           console.log(err);
       })
     }
   });
   }

   module.exports.help = {
     name: "gangleader"
   }
