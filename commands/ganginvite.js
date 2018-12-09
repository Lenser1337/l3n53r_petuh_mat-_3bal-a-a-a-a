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
        newMembers.push(target.id);
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

  var leader_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});

  if (typeof leader_obj.leaderOf == 'undefined' || leader_obj.leaderOf == null)
    return message.reply("разве ты лидер группировки?");

  var inviteTarget = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!inviteTarget)
    return message.reply("укажите пользователя!");

  var target_obj = await User.findOne({userID: inviteTarget.id}, function(err, found_user){});

  if (typeof target_obj.gang == 'undefined' || leader_obj.gang == null)
    return message.reply(inviteTarget " уже является членом другой группировки!");

  var gang_obj = await Gang.findOne({name: leader_obj.leaderOf}, function(err, found_user){});

  //1 лвл - 5 человек, 2 лвл - 15 человек, 3 лвл - 25 человек, 4 лвл - 35 человек, 5 лвл - 50 человек

  if ((gang_obj.level == 1 && gang_obj.membersAmount == 5) || (gang_obj.level == 2 && gang_obj.membersAmount == 15) || (gang_obj.level == 3 && gang_obj.membersAmount == 25) || (gang_obj.level == 4 && gang_obj.membersAmount == 35) || (gang_obj.level == 5 && gang_obj.membersAmount == 50))
    return message.reply("в группировке " + gang_obj.level + " уровня может быть до " + gang_obj.membersAmount + " пользователей!");

  var dmChannel = inviteTarget.createDM();
  dmChannel.send("Привет! " + message.member + " приграсил тебя вступить в " + gang_obj.name + "!");
  dmChannel.send("Принять приглашение? (да/нет)");
  var filter = m => m.author.id === inviteTarget.id;
  dmChannel.awaitMessages(filter, {
    max: 1,
    time: 60000
  }).then(collected => {
    if (collected.first().content == "да") {
      dmChannel.send("теперь ты часть " + gang_obj.name);
      message.reply(inviteTarget + " принял твое приглашение!");
      makeMagic(target_obj, leader_obj, gang_obj, bot, message);
    }
    else if (collected.first().content == "нет") {
      dmChannel.send("Понял, принял!");
      message.reply(inviteTarget + " не принял твое приглашение!");
    }
    else{
      dmChannel.send("нужно отвечать **да** или **нет**, приглашение исчерпано!");
      message.reply(inviteTarget + " не принял твое приглашение!");
    }
  }).catch(err => {
    dmChannel.send("время вышло!");
    message.reply(inviteTarget + " не принял твое приглашение!");
  });
  inviteTarget.deleteDM();
}


module.exports.help = {
	name: "ganginvite"
}
