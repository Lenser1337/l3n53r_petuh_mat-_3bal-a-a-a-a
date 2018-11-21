const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/report_model.js');

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Тех. Стажер", "Комиссар полиции", "Шериф"].includes(r.name)))
    return;

  let resetModer = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

  if(resetModer && resetModer.roles.some(r=>["Бездушные"].includes(r.name)))
    return;

  if (!resetModer)
    return message.reply("укажи кого-то!");

	var respect = bot.emojis.find("name", "FforRespect");

  	message.delete().catch(O_o=>{});

    	var user_obj = User.findOne({
    		moderID: resetModer.id
    	}, function (err, foundObj) {
    		if (err)
    			console.log("Error on database findOne: " + err);
    		else {
    			if (!foundObj){
    				console.log("User not found in database");
    				return message.reply('этот пользователь еще не модерировал на сервере');
    			}
    			else {
            var newresetedwarns = foundObj.resetedwarns + foundObj.warnsAmount;
            var newresetedinfractions = foundObj.resetedinfractions + foundObj.infractionsAmount;
            var newresetedmutes = foundObj.resetedmutes + foundObj.muteAmount;
            var newresetedvoicemutes = foundObj.resetedvoicemutes + foundObj.voicemuteAmount;

            foundObj.warnsAmount = 0;
          	foundObj.infractionsAmount = 0;
          	foundObj.muteAmount = 0;
          	foundObj.voicemuteAmount = 0;
          	foundObj.resetedwarns = newresetedwarns;
          	foundObj.resetedinfractions = newresetedinfractions;
          	foundObj.resetedmutes = newresetedmutes;
          	foundObj.resetedvoicemutes = newresetedvoicemutes;
            foundObj.save(function(err, updatedObj){
      				if(err)
      					console.log(err);
      				});

            message.channel.send(`у <@${resetModer.id}> обновлён счётчик! ${respect}`).then(msg => msg.delete(3000));
          }
  			}
  		});
  }

module.exports.help = {
	name: "resetpolice"
}
