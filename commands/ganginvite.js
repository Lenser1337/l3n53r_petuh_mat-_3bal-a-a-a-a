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

function makeMagic(target, leader, gang, bot, message){

  var user_obj = User.findOne({userID: target.userID}, function(err, found_user){
    if (err)
      console.log("WTF there is an error: " + err);
    else {
      if (!user_obj)
        console.log("User not found");
      else {
        found_user.gang = gang.name;
        found_user.save(function(err, updatedObj){
          if (err)
            console.log(err);
        });
      }
    }
  });

  var gang_obj = Gang.findOne({name: gang.name}, function(err, found_gang){
    if (err)
      console.log("WTF there is an error: " + err);
    else {
      if (!gang_obj)
        console.log("Gang not found");
      else {
        var newAmount = found_gang.membersAmount + 1;
        found_gang.membersAmount = newAmount;
        var newMembers = gang.otherMembers;
        newMembers.push(target.userID);
        found_gang.otherMembers = newMembers;
        found_gang.save(function(err, updatedObj){
          if (err)
            console.log(err);
        });
      }
    }
  });
}

module.exports.run = async (bot, message, args) => {

  var ahahaIcon = bot.emojis.find("name", "ahaha_mad");

  var leader_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});

  if (typeof leader_obj.leaderOf == 'undefined' || leader_obj.leaderOf == null)
    return message.reply(`разве ты лидер группировки? ${ahahaIcon}`);

  var inviteTarget = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!inviteTarget)
    return message.reply("укажите пользователя!");

  if (inviteTarget.id == message.member.id)
    return message.reply("эмм, чееееееееее ");

  var target_obj = await User.findOne({userID: inviteTarget.id}, function(err, found_user){});

  if (typeof target_obj.gang !== 'undefined' && target_obj.gang !== null)
    return message.reply(`${inviteTarget} уже является членом другой группировки!`);

  var gang_obj = await Gang.findOne({name: leader_obj.leaderOf}, function(err, found_user){});

  //1 лвл - 5 человек, 2 лвл - 15 человек, 3 лвл - 25 человек, 4 лвл - 35 человек, 5 лвл - 50 человек

  if ((gang_obj.level == 1 && gang_obj.membersAmount >= 5) || (gang_obj.level == 2 && gang_obj.membersAmount >= 15) || (gang_obj.level == 3 && gang_obj.membersAmount >= 25) || (gang_obj.level == 4 && gang_obj.membersAmount >= 35) || (gang_obj.level == 5 && gang_obj.membersAmount >= 50)){
    var nextlevel = gang_obj.level + 1;
    return message.reply("твоя группировка достигла максимального количества участников на данном уровне! Что бы пригласить больше людей, пожалуйста, прокачай группировку до " + nextlevel + " уровня!");
  }

  var gangRole = message.guild.roles.find(`name`, gang_obj.name);

  if(!gangRole)
    return message.channel.send("обратитесь к администрации, у вашей группировки что-то не так с ролью! Возможно, вы недавно решили переименоваться!");
  var dmChannel = inviteTarget.createDM().then(function(dmChannel){
    dmChannel.send(`Привет! ${message.member.displayName} приграсил тебя вступить в **` + gang_obj.name + "**!");
    dmChannel.send("Принять приглашение? (да/нет)");
    var filter = m => m.author.id === inviteTarget.id;
    dmChannel.awaitMessages(filter, {
      max: 1,
      time: 60000
    }).then(collected => {
      if (collected.first().content == "да" || collected.first().content == "Да" || collected.first().content == "ДА") {
        dmChannel.send("Теперь ты в **" + gang_obj.name + "**!");
        message.reply(`${inviteTarget} принял твое приглашение!`);
        makeMagic(target_obj, leader_obj, gang_obj, bot, message);
        inviteTarget.addRole(gangRole);
      }
      else if (collected.first().content == "нет" || collected.first().content == "Нет") {
        dmChannel.send("Понял, принял!");
        message.reply(`${inviteTarget} не принял твое приглашение!`);
      }
      else{
        dmChannel.send("нужно отвечать **да** или **нет**, приглашение исчерпано!");
        message.reply(`${inviteTarget} не принял твое приглашение!`);
      }
    }).catch(err => {
      dmChannel.send("время вышло!");
      message.reply(`${inviteTarget} не принял твое приглашение!`);
    });
  }).catch(function(error){
    console.log(error);
  });
}


module.exports.help = {
	name: "ganginvite"
}
