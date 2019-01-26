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


module.exports.run = async (bot, message, args) => {

  var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});

  var gang_obj = await Gang.findOne({leaderID: message.member.id}, function(err, found_gang){});

  if (typeof gang_obj !== 'undefined' && gang_obj !== null)
    return message.reply("ты являешься лидером группировки...");

  if (typeof user_obj.gang == 'undefined' || user_obj.gang == null)
    return message.reply("разве ты находишься в какой-либо группировке?");

  var user = message.guild.members.find("id", message.member.id);

  var gangRole = message.guild.roles.find(`name`, user_obj.gang);

  if(!gangRole)
    return message.channel.send("Обратитесь к администрации, у вашей группировки что-то не так с ролью! Возможно, вы недавно решили переименоваться!");

  var gang_obj = Gang.findOne({
    name: user_obj.gang
  }, function(err, found_gang){
    if (err)
      console.log("WTF there is an error: " + err);
    else {
      if (!gang_obj)
        console.log("Gang not found");
      else {
        var newAmount = found_gang.membersAmount - 1;
        found_gang.membersAmount = newAmount;
        var newMembers = found_gang.otherMembers;
        newMembers.slice(message.member.id);
        found_gang.otherMembers = newMembers;
        found_gang.save(function(err, updatedObj){
          if (err)
            console.log(err);
          });
        message.member.removeRole(gangRole);
      }
    }
  });
  user_obj.gang == null;
  user_obj.save(function(err, updatedObj){
    if(err)
      console.log(err);
  });
  message.reply("ливнул из группировки!")
}


module.exports.help = {
	name: "gangleave"
}
