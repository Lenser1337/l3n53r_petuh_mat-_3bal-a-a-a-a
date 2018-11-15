const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

function rob(message, bot, toRob, robResult, robed){

	var retricIcon = bot.emojis.find("name", "retric");

	var user_obj = User.findOne({
		userID: message.member.id
	}, function (err, foundObj) {
		if (err){
			console.log("Error on database findOne: " + err);
		}
		else {
			if (!foundObj)
				console.log("Something stange happend");
			else {
				var newCash = 0;
				if (robResult == true)
					newCash = foundObj.retrocoinCash + toRob;
				else {
					newCash = foundObj.retrocoinCash - toRob;
				}
				foundObj.retrocoinCash = newCash;
				foundObj.retrocoinTotal = foundObj.retrocoinBank + newCash;
				foundObj.lastRob = Date.now();
				foundObj.save(function(err, updatedObj){
					if(err)
						console.log(err);
				});
				if(robResult == true)
					return message.reply(`ты свистнул у ${robed} ${toRob}${retricIcon}!`);
				else
					return message.reply(`ты влетел на ${toRob}${retricIcon}!`)
			}
		}
	});
}

module.exports.run = async (bot, message, args) => {

	var casino_channel = message.guild.channels.find(`name`, "🎰казино_экономика");
	var shop_channel = message.guild.channels.find(`name`, "💸основное_экономика");

	//🕵секретный_чат / 🍲комната_отдыха

	if (message.channel.name != "🎰казино_экономика" && message.channel.name != "💸основное_экономика"
	&& message.channel.name != "🕵секретный_чат" && message.channel.name != "🍲комната_отдыха" && message.channel.name != "🌎general_bots"){
		message.delete(3000);
    	return message.reply(`робать можно только в ${casino_channel} и ${shop_channel}`).then(msg => msg.delete(10000));
    }

	var robed = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

	if (!robed)
		return message.reply("пользователь не найден / не указан!");

	if (robed.id == message.author.id)
		return message.reply("самого себя грабить не логично :thinking:")

	var user_obj = User.findOne({
		userID: robed.id
	}, function (err, foundObj) {
		if (err)
			console.log("Error on database findOne: " + err);
		else {
			if (!foundObj){
				console.log("User not found in database");
				return;
			}
			else {
				var min = 1;
				var max = 2;
				var robResult = (Math.floor(Math.random() * (max - min + 1)) + min) == 1 ? true : false;

				if(robed.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name))){
					console.log(message.member.displayName + ' попытался грабануть ' + robed.displayName);
					robResult = false;
				}

				min = 35;
				max = 45;
				var random = Math.floor(Math.random() * (max - min + 1)) + min;
				var toRob = foundObj.retrocoinCash / 100 * random;
				toRob = Math.round(toRob);
				if (foundObj.retrocoinCash - toRob <= 0)
					return message.reply("у человека туго с наличкой, его робнуть не получится!");
				var user_obj = User.findOne({
					userID: message.member.id
				}, function (err, foundObj2) {
					var dateTime = Date.now();
					var timestamp = Math.floor(dateTime/1000);
					var timestampLimit = Math.floor(foundObj2.lastRob/1000) + (60*15);
					if (timestampLimit > timestamp)
						return message.reply("эээ, грабь, но не чаще, чем раз в 15 минут...");
					else {
						if (robResult == true){
							foundObj.retrocoinCash = foundObj.retrocoinCash - toRob;
							foundObj.retrocoinTotal = foundObj.retrocoinBank + foundObj.retrocoinCash;
							rob(message, bot, toRob, robResult, robed);
						}
						else {
							rob(message, bot, toRob, robResult, robed);
						}
						foundObj.save(function(err, updatedObj){
							if(err)
								console.log(err);
						})
					}
				});
			}
		}
	});
}

module.exports.help = {
	name: "rob"
}
