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

function updateGang(bot, message, gangName, user_id){
  var gang_obj = Gang.findOne({name: gangName}, function(err, found_gang){
    if (err)
      console.log("WTF there is an error: " + err);
    else {
      if (!gang_obj)
        console.log("User not found");
      else {
        var newAmount = found_gang.membersAmount - 1;
        found_gang.membersAmount = newAmount;
        var newMembers = found_gang.otherMembers;
        var index = newMembers.indexOf(user_id);
        newMembers.splice(index, 1);
        found_gang.otherMembers = newMembers;
        found_gang.save(function(err, updatedObj){
          message.reply("ты ливнул из группировки!");
        });
      }
    }
  });
}

function updateUser(bot, message, gangName, user_id){
  var user_obj = User.findOne({userID: user_id}, function(err, found_user){
    if (err)
      console.log("WTF there is an error: " + err);
    else {
      if (!user_obj)
        console.log("User not found");
      else {
        found_user.gang = null;
        found_user.save(function(err, updatedObj){});
        updateGang(bot, message, gangName, user_id);
      }
    }
  });
}

module.exports.run = async (bot, message, args) => {

  var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});
  var gang_obj = await Gang.findOne({leaderID: message.member.id}, function(err, found_gang){});

  if (typeof gang_obj !== 'undefined' && gang_obj !== null)
    return message.reply("ты являешься лидером группировки...");

  if (typeof user_obj.gang == 'undefined' || user_obj.gang == null)
    return message.reply("разве ты находишься в какой-либо группировке?");

  gang_obj = await Gang.findOne({name: user_obj.gang}, function(err, found_gang){});

  if (gang_obj.level < 2 || gang_obj.level == null)
    return message.reply("твоя группировка не достигла 2 уровня и поэтому вам не доступна эта команда");
  var user = message.guild.members.find("id", message.member.id);
  var gangRole = message.guild.roles.find(`name`, user_obj.gang);

  if(!gangRole)
    return message.channel.send("Обратитесь к администрации, у вашей группировки что-то не так с ролью! Возможно, вы недавно решили переименоваться!");

  message.member.removeRole(gangRole);
  updateUser(bot, message, gang_obj.name, message.member.id);
}


module.exports.help = {
	name: "gangleave"
}
