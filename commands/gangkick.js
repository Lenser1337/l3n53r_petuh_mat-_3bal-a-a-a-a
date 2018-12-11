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
        found_user.gang = undefined;
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
        var newAmount = found_gang.membersAmount - 1;
        found_gang.membersAmount = newAmount;
        var newMembers = gang.otherMembers;
        var index = newMembers.indexOf(target.id);
        newMembers.splice(index, 1);
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

  var kickTarget = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!kickTarget)
    return message.reply("укажите пользователя!");

  if (kickTarget.id == message.member.id)
    return message.reply("самого себя исключить нельзя!");

  var target_obj = await User.findOne({userID: kickTarget.id}, function(err, found_user){});

  if (target_obj.gang != leader_obj.gang)
    return message.reply(`${kickTarget} разве этот человек в твоей группировке?`);

  var gang_obj = await Gang.findOne({name: leader_obj.leaderOf}, function(err, found_user){});

  var gangRole = message.guild.roles.find(`name`, gang_obj.name);

  if(!gangRole)
    return message.channel.send("обратитесь к администрации, у вашей группировки что-то не так с ролью! Возможно, вы недавно решили переименоваться!");

  makeMagic(target_obj, leader_obj, gang_obj, bot, message);
  kickTarget.removeRole(gangRole);
  message.reply(kickTarget.displayName + " был исключен из группировки!");
}


module.exports.help = {
	name: "gangkick"
}
