const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');


function isNumeric(value) {
	return /^\d+$/.test(value);
}

function random(min, max) {
	var result = Math.floor(Math.random() * (max - min + 1)) + min;
	return (result);
}

module.exports.run = async (bot, message, args) => {

  message.delete(3000);

	if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Тех. Стажер"].includes(r.name)))
		return message.reply("похоже у тебя нехватка прав!").then(msg => msg.delete(10000));

		message.delete().catch(O_o=>{});

	var retricIcon = bot.emojis.find("name", "retric");
	var simpleIcon = bot.emojis.find("name", "this_is_simple");
	let muser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
	if(!muser)
		return message.reply("пользователь не указан / не существует!").then(msg => msg.delete(10000));
	let plase = args[1];
	let amountin = args[2];
	if(isNaN(amountin))
		return message.reply("введите число!").then(msg => msg.delete(10000));
	let amount = Number(amountin);
	if(amount<0)
		return message.reply("введите положительное число!").then(msg => msg.delete(10000));

	var user_obj = User.findOne({
		userID: muser.id
	}, function (err, foundObj) {
		if (err){
			console.log("Error on database findOne: " + err);
		}
		else {
			if (!foundObj)
				console.log("Something stange happend");
			else {

				if(plase == "bank"){
					foundObj.retrocoinBank = foundObj.retrocoinBank + amount;
					foundObj.retrocoinTotal = foundObj.retrocoinBank + foundObj.retrocoinCash;
					message.channel.send(`Пользователю <@${muser.id}> добавлено ${amount}${retricIcon} в банк!`).then(msg => msg.delete(10000));
				}
				else if(plase == "cash"){
					foundObj.retrocoinCash = foundObj.retrocoinCash + amount;
					foundObj.retrocoinTotal = foundObj.retrocoinBank + foundObj.retrocoinCash;
					message.channel.send(`Пользователю <@${muser.id}> добавлено ${amount}${retricIcon} на наличку!`).then(msg => msg.delete(10000));
				}
				else{
					return message.reply("параметры не верны!").then(msg => msg.delete(10000));
				}

				foundObj.save(function(err, updatedObj){
					if(err)
						console.log(err);
				});
			}
		}
	});
}

module.exports.help = {
	name: "addmoney"
}
