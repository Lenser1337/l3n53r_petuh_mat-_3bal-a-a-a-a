const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');


// function isNumeric(value) {
// 	return /^\d+$/.test(value);
// }

function random(min, max) {
	var result = Math.floor(Math.random() * (max - min + 1)) + min;
	return (result);
}

module.exports.run = async (bot, message, args) => {

	var shop_channel = message.guild.channels.find(`name`, "💸основное_экономика");

	//🕵секретный_чат / 🍲комната_отдыха

	if (message.channel.name != "💸основное_экономика" && message.channel.name != "🕵секретный_чат" && message.channel.name != "🍲комната_отдыха" && message.channel.name != "🌎general_bots"){
		message.delete(3000);
			return message.reply(`работать можно только в ${shop_channel}`).then(msg => msg.delete(10000));
		}


	var retricIcon = bot.emojis.find("name", "retric");
	var simpleIcon = bot.emojis.find("name", "this_is_simple");

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

				var resultOfCrime = random(1, 100);

				var dateTime = Date.now();
				var timestamp = Math.floor(dateTime/1000);
				if (foundObj.lastCrimeResult == true)
					var timestampLimit = Math.floor(foundObj.lastCrime/1000) + 18000;
				else
					var timestampLimit = Math.floor(foundObj.lastCrime/1000) + 5400;


				if (timestampLimit > timestamp)
					return message.reply(`ты слишком устал... Отдохни еще немного, грабежи и налеты - дело утомительное ${simpleIcon}`);

				var toPay = random(4000, 7000);

				if (resultOfCrime <= 30){
					var newCash = foundObj.retrocoinCash + toPay;
				}
				else{
					if(foundObj.retrocoinTotal >= 0){
						toPay = Math.floor(foundObj.retrocoinTotal / 100 * 30);
						var newCash = foundObj.retrocoinCash - toPay;
					}
					else{
					 return message.reply(`у тебя не хватает ${retricIcon} (ретриков) на это действие!`)
					}
				}

				foundObj.retrocoinCash = newCash;
				foundObj.retrocoinTotal = foundObj.retrocoinBank + newCash;
				foundObj.lastCrime = dateTime;

				var answers = [];
				answers.push(`заглянув в бар утром, ты нашел кошелек, который ноунейм забыл по пьяни, и в нём оказалось ${toPay} ${retricIcon}!`);
				answers.push(`такими темпами, тебя все группировки в городе бояться будут. Так держать! ${toPay} ${retricIcon}!`);

				var answers2 =[];
				answers2.push(`ты ведь мог выйти в плюс, если бы вновь проверил свой план. Ты заложил:${toPay} ${retricIcon}!`);
				answers2.push(`это был самый дерьмовый налет на киоск с шаурмой в твоей жизни... Тебя оштрафовали на: ${toPay} ${retricIcon}!`);
				answers2.push(`неудачное преступление! Вы были пойманы, пытаясь ограбить старушку и получили штраф в размере ${toPay} ${retricIcon}!`);

				if (resultOfCrime <= 30){
					var index = Math.floor((Math.random() * answers.length));
					var answer = answers[index];
					foundObj.lastCrimeResult = true;
				}
				else {
					var index = Math.floor((Math.random() * answers2.length));
					var answer = answers2[index];
					foundObj.lastCrimeResult = false;
				}

				message.reply(answer);

				foundObj.save(function(err, updatedObj){
					if(err)
						console.log(err);
				});
			}
		}
	});
}

module.exports.help = {
	name: "crime"
}
