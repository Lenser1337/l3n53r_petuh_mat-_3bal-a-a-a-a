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

function changeGangLeader(leader, target, gang, bot, message){

  console.log("leader name: " + leader.displayName + ", new leader name: " + target.displayName + ", gang name: " + gang.name);

  var newLeader_obj = User.findOne({userID: target.id}, function (err, foundObj){
    foundObj.leaderOf = gang.name;
    foundObj.save(function(err, updatedObj){
      if (err)
        console.log(err);
    });
  });

  var gang_obj = Gang.findOne({name: gang.name}, function (err, foundObj){
    foundObj.leaderID = target.id;
    foundObj.save(function(err, updatedObj){
      if (err)
        console.log(err);
    });
  });

  var pastLeader_obj = User.findOne({userID: leader.id}, function (err, foundObj){
    foundObj.leaderOf = undefined;
    foundObj.save(function(err, updatedObj){
      if (err)
        console.log(err);
    });
  });

  message.channel.send(`<@${target.id}> стал главарём группировки **${gang.name}**`);
}

module.exports.run = async (bot, message, args) => {
  var newleader = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if (message.member.id == newleader.id)
    return message.reply("чеееееееееее");
  if (!newleader)
    return message.reply("вы не указали кто станет лидером!");

  //Подключаемся ко всем нужным Коллекциям в ДатаБазе
  var leader_obj = await User.findOne({userID: message.member.id}, function (err, foundObj){});
  var target_obj = await User.findOne({userID: newleader.id}, function (err, foundObj){});
  var gang_obj = await Gang.findOne({leaderID: message.member.id}, function (err, foundObj){});

  if ((leader_obj == null || typeof leader_obj == 'undefined') || (target_obj == null || typeof target_obj == 'undefined') || (gang_obj == null || typeof gang_obj == 'undefined')){
    console.log('wtf!');
    return;
  }

  //Проверяем есть ли у подозреваемого лидера группировка
  console.log("leader nickname: " + leader_obj.displayName);
  console.log("fckng type" + typeof leader_obj.leaderOf);
  console.log("Leader of: " + leader_obj.leaderOf);

  if (typeof leader_obj.leaderOf == 'undefined' || leader_obj.leaderOf == null)
    return message.reply("ты не лидер группировки!");

  if (leader_obj.gang !== target_obj.gang)
    return message.reply("твоя цель не в твоей группировке!");

  changeGangLeader(leader_obj, target_obj, gang_obj, bot, message);
}

module.exports.help = {
  name: "gangleader"
}
