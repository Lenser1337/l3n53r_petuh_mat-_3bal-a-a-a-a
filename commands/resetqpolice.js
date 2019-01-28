const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/qreport_model.js');

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Главный редактор", "Губернатор", "Комиссар"].includes(r.name)))
    return;

  let resetuser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

  if(resetuser && resetuser.roles.some(r=>["Бездушные"].includes(r.name)))
    return;

  if (!resetuser)
    return message.reply("укажи кого-то!");

	var respect = bot.emojis.find("name", "FforRespect");

  	message.delete().catch(O_o=>{});

    	var user_obj = User.findOne({
    		userID: resetuser.id
    	}, function (err, foundObj) {
    		if (err)
    			console.log("Error on database findOne: " + err);
    		else {
    			if (!foundObj){
    				console.log("User not found in database");
    				return message.reply('этот пользователь еще не модерировал на сервере');
    			}
    			else {
						if (typeof foundObj.resetedq == 'undefined')
						var newresetedq = 0 + foundObj.q;
						else
            var newresetedq = foundObj.resetedq + foundObj.q;

            foundObj.q = 0;
          	foundObj.resetedq = newresetedq;
            foundObj.save(function(err, updatedObj){
      				if(err)
      					console.log(err);
      				});

            message.channel.send(`У <@${resetuser.id}> обновлён счётчик! ${respect}`).then(msg => msg.delete(3000));
          }
  			}
  		});
  }

module.exports.help = {
	name: "resetqpolice"
}
