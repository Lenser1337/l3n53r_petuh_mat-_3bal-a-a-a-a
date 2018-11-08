const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

function kiss(kissed, message, bot){

	var retricIcon = bot.emojis.find("name", "retric");

	var user_obj = User.findOne({
		userID: kissed.id
	}, function (err, foundObj) {
		if (err){
			console.log("Error on database findOne: " + err);
		}
		else {
			if (!foundObj)
				console.log("Something stange happend");
			else {
				foundObj.kissed = foundObj.kissed + 1;
				foundObj.save(function(err, updatedObj){
				if(err)
					console.log(err);
				});
				return message.channel.send(`${kissed} :kissing_heart:`).then(msg => msg.delete(10000));
			}
		}
	});
}

module.exports.run = async (bot, message, args) => {

  message.delete(3000);

	if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "🚨РетроТестер🚨"].includes(r.name)))
		return;

	var kissed = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

	if (!kissed)
		return message.reply("пользователь не найден / не указан!").then(msg => msg.delete(10000));

	if (message.member == kissed)
		return message.reply("самого себя поцеловать не выйдет!").then(msg => msg.delete(10000));

	if (!args[1]) {
		var user_obj = User.findOne({
			userID: message.member.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj){
					console.log("User not found in database");
					return;
				}
				else {
					var dateTime = Date.now();
					var timestamp = Math.floor(dateTime/1000);
					var timestampLimit = Math.floor(foundObj.lastKiss/1000) + 900;
					if (timestampLimit > timestamp)
						return message.reply("нельзя так часто целоваться!").then(msg => msg.delete(10000));

					kiss(kissed, message, bot);

					foundObj.lastKiss = dateTime;

					foundObj.save(function(err, updatedObj){
					if(err)
						console.log(err);
					})
				}
			}
		});
	}
	else
		return message.reply("чеееее :thinking:").then(msg => msg.delete(10000));
}

module.exports.help = {
	name: "kiss"
}
