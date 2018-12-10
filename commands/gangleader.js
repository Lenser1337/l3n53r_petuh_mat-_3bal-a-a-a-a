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

  //Подключаемся ко всем нужным Коллекциям в ДатаБазе
   var gangLeader_obj = Gang.findOne({leaderID: message.member.id}, function (err, foundgangLeader){});
   var gangUser_obj = Gang.findOne({leaderID: newleader.id}, function (err, foundgangUser){});
   var userUser_obj = User.findOne({userID: newleader.id}, function (err, founduserUser){});
   var userLeader_obj = User.findOne({userID: message.member.id}, function (err, founduserLeader){});

    //Проверяем есть ли у подозреваемого лидера группировка
     if (gangLeader_obj == undefined)
       message.reply("вы не являетесь лидером какой-либо группировки!");

    //Делаем gangName = названию группировки
     var gangName = userLeader_obj.name;

    //Проверяем не является ли наш будущий лидер лидером какой-либо другой группировки
     if (gangUser_obj !== undefined)
       message.reply(`этот пользователь уже является лидером другой группировки!`);

    //Проверяем не пытается ли лидер отдать звание лидера самому себе...
     if (message.member.id == newleader.id)
        message.reply("ты же понимаешь, что нельзя отдать звание лидера самому себе?");

    //Проверяем не состоит ли будущий лидер в какой-либо другой группировке
     if (userUser_obj.gang !== gangName && userUser_obj.gang !== undefined)
        message.reply("этот пользователь состоит в другой группировке!");

     //Меняем в файле группировке лидера и отправляем сообщение о новом лидере
     gangLeader_obj.leader = newleader;
     gangLeader_obj.leaderID = newleader.id;
        message.channel.send(`<@${newleader.id}> стал главарём группировки под названием **${gangLeader_obj.name}**!`);

     //Меняем в файле нового лидера leaderOf
     userUser_obj.leaderOf = gangName;

     //Делаем в файле прошлого лидера leaderOfпустым
     userLeader_obj.leaderOf = undefined;
   }

   module.exports.help = {
     name: "gangleader"
   }
