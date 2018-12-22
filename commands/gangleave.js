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
  consol.log("leaderOf": user_obj.leaderOf);
  if (typeof user_obj.leaderOf !== 'undefined' || user_obj.leaderOf !== null)
    message.reply("ты являешься лидером группировки...")

  if (typeof user_obj.gang == 'undefined' || user_obj.gang == null)
    return message.reply("разве ты находишься в какой-либо группировке?");

  var user = message.guild.members.find("id", message.member.id);


  //1 лвл - 5 человек, 2 лвл - 15 человек, 3 лвл - 25 человек, 4 лвл - 35 человек, 5 лвл - 50 человек

  var gangRole = message.guild.roles.find(`name`, user_obj.name);

  if(!gangRole)
    return message.channel.send("обратитесь к администрации, у вашей группировки что-то не так с ролью! Возможно, вы недавно решили переименоваться!");

    var gang_obj = await Gang.findOne({
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
          var newMembers = gang.otherMembers;
          newMembers.splice(target.id);
          found_gang.otherMembers = newMembers;
          found_gang.save(function(err, updatedObj){
            if (err)
              console.log(err);
            });
          message.member.removeRole(found_gang.name);
        }
      }
    });



     user_obj.gang = null;
     message.reply("ливнул из группировки!")
     user.sendMessage("Поздравляем, ты ливнул из группировки!")
}


module.exports.help = {
	name: "gangleave"
}
