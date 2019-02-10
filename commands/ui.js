const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {

  let aktivist = message.guild.roles.find(`name`, "🔋 Активист");
	let samiy_aktivniy = message.guild.roles.find(`name`, "Самый активный");

  let bundar = message.guild.roles.find(`name`, "Бундарь");
  let dyta_anarhii = message.guild.roles.find(`name`, "Дитя анархии");

  var perk_aktivist_or_samiy_aktivniy = ":red_circle: закрыто";
  var perk_bundar_or_antikop = ":red_circle: закрыто";


    //Дитя батарейки
  if(message.member.roles.some(r=>["Самый активный"].includes(r.name))){
    perk_aktivist_or_samiy_aktivniy = ":large_blue_circle: Дитя батарейки";
    //Активист
  } else if (message.member.roles.some(r=>["🔋 Активист"].includes(r.name))){
    perk_aktivist_or_samiy_aktivniy = ":large_blue_circle: 🔋 Активист";
  } else {
    perk_aktivist_or_samiy_aktivniy = ":red_circle: закрыто";
  }

    //АнтиКоп
  if(message.member.roles.some(r=>["Дитя анархии"].includes(r.name))){
    perk_bundar_or_antikop = ":large_blue_circle: АнтиКоп";
    //Активист
  } else if (message.member.roles.some(r=>["Бундарь"].includes(r.name))){
    perk_bundar_or_antikop = ":large_blue_circle: Бундарь";
  } else {
    perk_bundar_or_antikop = ":red_circle: закрыто";
  }




  message.delete(3000);

  if(!args[0]){

    var retricIcon = bot.emojis.find("name", "retric");
    var hmmIcon = bot.emojis.find("name", "hmm");

    var user_obj = User.findOne({
      userID: message.member.id
    }, function (err, foundObj) {
      if (err)
        console.log("Error on database findOne: " + err);
      else {
        if (!foundObj)
          console.log("Something stange happend");
        else {
          var stats = `Половых актов : ${foundObj.fcked}\nПоцелован(а) : ${foundObj.kissed}\nОбнят(а) : ${foundObj.huged}\nПобит(а) : ${foundObj.hit}\nУбит(а) : ${foundObj.killed}\nЗапой : ${foundObj.drunk}`;
          if (foundObj.chickenPower && foundObj.chickenPower >= 50)
            stats = stats.concat(`\n🐔 : ${foundObj.chickenPower}%`);
          message.channel.send({embed: {
            color: message.member.highestRole.color,
            icon_url: message.guild.iconURL,
            title: `**Retro Valley** :zap: **${message.member.displayName}**`,
            description: `(**высшая роль :** __**${message.member.highestRole.name}**__)`,
            fields: [
            {
              name: `***Личный статус*** :speech_left:`,
              value: `${foundObj.status}`
            },
            {
              name: `***Личный баланс : *** ${numberWithCommas(foundObj.retrocoinTotal)} ${retricIcon}`,
              value: `__**Нарушений**__ : ${foundObj.infractions}`
            },
            {
              name: "\n***Взаимодействия :***",
              value: stats
            },
            {
              name: "\n***Доступные перки :***",
              value: perk_aktivist_or_samiy_aktivniy + "\n" + perk_bundar_or_antikop + "\n:red_circle: закрыто\n:red_circle: закрыто\n:red_circle: закрыто\n:red_circle: закрыто\n:red_circle: закрыто\n:red_circle: закрыто\n:red_circle: закрыто"
            }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: message.author.avatarURL,
              text: `© ${message.member.displayName}`
            },
            thumbnail: {
              url: `${message.member.user.avatarURL}`
            }
          }
        }).then(msg => msg.delete(10000));
        }
      }
    });
  } else {
    let iUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!iUser)
      return message.reply("пользователь не найден / не указан!");

    var retricIcon = bot.emojis.find("name", "retric");
    var hmmIcon = bot.emojis.find("name", "hmm");

    var user_obj = User.findOne({
      userID: iUser.id
    }, function (err, foundObj) {
      if (err)
        console.log("Error on database findOne: " + err);
      else {
        if (!foundObj)
          console.log("Something stange happend");
        else {

          var stats = `Половых актов : ${foundObj.fcked}\nПоцелован(а) : ${foundObj.kissed}\nОбнят(а) : ${foundObj.huged}\nПобит(а) : ${foundObj.hit}\nУбит(а) : ${foundObj.killed}\nЗапой : ${foundObj.drunk}`;
          if (foundObj.chickenPower && foundObj.chickenPower >= 50)
            stats = stats.concat(`\n🐔 : ${foundObj.chickenPower}%`);

          message.channel.send({embed: {
            color: message.member.highestRole.color,
            icon_url: message.guild.iconURL,
            title: `**Retro Valley** :zap: **${iUser.displayName}**`,
            description: `(**высшая роль :** __**${iUser.highestRole.name}**__)`,
            fields: [
            {
              name: `***Личный статус*** :speech_left:`,
              value: `${foundObj.status}`
            },
            {
              name: `***Личный баланс : *** ${numberWithCommas(foundObj.retrocoinTotal)} ${retricIcon}`,
              value: `__**Нарушений**__ : ${foundObj.infractions}`
            },
            {
              name: "\n***Взаимодействия :***",
              value: stats
            },
            {
              name: "\n***Доступные перки :***",
              value: ":red_circle: закрыто\t:red_circle: закрыто\t:red_circle: закрыто\n:red_circle: закрыто\t:red_circle: закрыто\t:red_circle: закрыто\n:red_circle: закрыто\t:red_circle: закрыто\t:red_circle: закрыто"
            }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: message.author.avatarURL,
              text: `© ${message.member.displayName}`
            },
            thumbnail: {
              url: `${iUser.user.avatarURL}`
            }
          }
        }).then(msg => msg.delete(10000));
        }
      }
    });
  }
}

module.exports.help = {
  name: "ui"
}
