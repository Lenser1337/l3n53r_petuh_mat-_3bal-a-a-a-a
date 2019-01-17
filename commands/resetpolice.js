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
  if(!message.member.roles.some(r=>["Тех. Администратор", "Комиссар полиции", "Шериф"].includes(r.name)))
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
						if (typeof foundObj.resetedwarns == 'undefined')
						var newresetedwarns = 0 + foundObj.warnsAmount;
						else
            var newresetedwarns = foundObj.resetedwarns + foundObj.warnsAmount;

						if (typeof foundObj.resetedinfractions == 'undefined')
						var newresetedinfractions = 0 + foundObj.infractionsAmount;
						else
            var newresetedinfractions = foundObj.resetedinfractions + foundObj.infractionsAmount;

						if(typeof foundObj.resetedmutes == 'undefined')
						var newresetedmutes = 0 + foundObj.muteAmount;
						else
            var newresetedmutes = foundObj.resetedmutes + foundObj.muteAmount;

						if(typeof foundObj.resetedvoicemutes == 'undefined')
						var newresetedvoicemutes = 0 + foundObj.voicemuteAmount;
						else
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

            message.channel.send(`У <@${resetModer.id}> обновлён счётчик! ${respect}`).then(msg => msg.delete(3000));
          }
  			}
  		});
  }

module.exports.help = {
	name: "resetpolice"
}
