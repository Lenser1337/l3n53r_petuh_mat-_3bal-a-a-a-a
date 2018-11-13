const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

module.exports.run = async (bot, message, args) => {

	var retricIcon = bot.emojis.find("name", "retric");
	var nopeIcon = bot.emojis.find("name", "nope");

	if (isNumeric(args[0]) && isNumeric(args[1])){
		var user_obj = User.findOne({
			userID: message.member.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj)
					console.log("Something stange happend");
				else {
					var dateTime = Date.now();
					var timestamp = Math.floor(dateTime/1000);
					var timestampLimit = Math.floor(foundObj.lastDice/1000) + 30;
					if (timestampLimit > timestamp)
						return message.reply("эээ, крути-верти, но не чаще, чем раз в пол минуты...");
					if (Number(args[0]) >= 100 && Number(args[1]) >= 1 && Number(args[1]) <= 6){
						var actCash = foundObj.retrocoinCash;
						var toPlay = Number(args[0]);
						var winner = false;
						if (actCash - toPlay >= 0){
							var newCash = actCash - toPlay;
							var min = 1;
  							var max = 6;
  							var result = Math.floor(Math.random() * (max - min + 1)) + min;
  							if (result == Number(args[1])){
  								newCash = toPlay * 6 + actCash;
  								winner = true;
  								var won = toPlay * 6;
  							}
  							foundObj.retrocoinCash = newCash;
							foundObj.retrocoinTotal = newCash + foundObj.retrocoinBank;
							foundObj.lastDice = Date.now();
							foundObj.save(function(err, updatedObj){
							if(err)
								console.log(err);
							});
							message.channel.send("Закидываю 🎲 ...");
							setTimeout(function(){
								if (winner == true){
									return message.channel.send(`...и вылетает ${result}! ${message.author}, ты только что выиграл ${won}${retricIcon}! Поздравляю :drum:`);
								}
								else
									return message.channel.send("...и вылетает " + result + "! Ну ничего, в другой раз повезет больше :stuck_out_tongue_winking_eye:");
						    }, 3000);
  						}
  						else
  							return message.reply("видимо у тебя не достаточно ретриков на руках :dark_sunglasses:");
					}
					else if (Number(args[0]) < 100)
						return message.reply("минимальная ставка - 100 ретриков!");
					else if (Number(args[1]) < 1 || Number(args[1]) > 6)
						return message.reply(`у куба всего 6 сторон, дядя ${nopeIcon}`);
				}
			}
		});
	}
	else if (!args[0])
		return message.reply("укажи ставку и твой прогноз!");
	else if (!args[1])
		return message.reply("на что ставить будем? От 1 до 6...");
}

module.exports.help = {
	name: "dice"
}
