const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {

	var retricIcon = bot.emojis.find("name", "retric");
	var nopeIcon = bot.emojis.find("name", "nope");
	var bravoIcon = bot.emojis.find("name", "bravo");
	var pepeIcon = bot.emojis.find("name", "pepe_hmm");
	var casino_channel = message.guild.channels.find(`name`, "🎰казино_экономика");

	// if (message.channel.name != "🎰казино_экономика" && message.channel.name != "🌎general_bots"
	// && message.channel.name != "🕵секретный_чат" && message.channel.name != "🍲комната_отдыха"){
	// 	message.delete(3000);
 //    	return message.reply(`в рулетку можно играть только в ${casino_channel}`).then(msg => msg.delete(10000));
 //    }

	if (isNumeric(args[0]) && (args[1])) {
		var user_obj = User.findOne({
			userID: message.member.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
				if (!foundObj)
					console.log("Something stange happend");
				else {
					var dateTime = Date.now();
					var timestamp = Math.floor(dateTime/1000);
					var timestampLimit = Math.floor(foundObj.lastRoulette/1000) + 30;
					if (timestampLimit > timestamp)
						return message.reply("эээ, крути-верти, но не чаще, чем раз в пол минуту...");
					}

					message.channel.send({
						files: [{
							attachment: 'https://retrobotproject.herokuapp.com/images/roulette.gif',
							name: 'roulette.gif'
						}]
					}).then(msg => msg.delete(4000));


				if ((Number(args[0]) >= 100 && args[1] == "красное") || (Number(args[0]) >= 100 && args[1] == "черное")){
						var actCash = foundObj.retrocoinCash;
						var toPlay = Number(args[0]);
						var winner = "";
						var min = 1;
						var max = 36;
						if (actCash - toPlay < 0)
						 return message.channel.send(`У тебя разве хватает ${retricIcon} (ретриков) на такое действие?`);
						if (args[1] == "красное")
								var x = "red";
							else
								var x = "black";
							var r = Math.floor(Math.random() * (max - min + 1)) + min;
							if (r == 1 || r == 3 || r == 5 || r == 7 || r == 9 || r == 12 || r == 14 ||
								r == 16 || r == 18 || r == 19 || r == 21 || r == 23 || r == 25 || r == 27 || r == 30 || r == 32 || r == 34 || r == 36)
								var winner = "red";
							else
								var winner = "black";
							if (x == winner){
								var won = toPlay;
								var newCash = actCash + won;
							}
							else{
								var won = toPlay;
								var newCash = actCash - won;
							}

							message.channel.send({
								files: [{
									attachment: 'https://retrobotproject.herokuapp.com/images/roulette.gif',
									name: 'roulette.gif'
								}]
							}).then(msg => msg.delete(4000));


							foundObj.retrocoinCash = newCash;
							foundObj.retrocoinTotal = newCash + foundObj.retrocoinBank;
							foundObj.lastRoulette = Date.now();
							foundObj.save(function(err, updatedObj){
								if(err)
									console.log(err);
							});

							setTimeout(function(){
								if (x == winner){
									var won = toPlay * 2;
									return message.reply(`вылетело ${r} ${args[1]}!!! Ты только что выиграл ${won}${retricIcon}! Поздравляю ${bravoIcon}`);
								}
								else{
									if (winner == "red")
										message.reply(`увы, но вылетело ${r} красное! Видимо ${args[1]} - не твое ${pepeIcon}`);
									else
										message.reply(`увы, но вылетело ${r} черное! Видимо ${args[1]} - не твое ${pepeIcon}`);
									return message.channel.send({
										files: [{
											attachment: 'https://retrobotproject.herokuapp.com/images/roulette_loss.gif',
											name: 'roulette_loss.gif'
										}]
									}).then(msg => msg.delete(4000));
								}
							}, 4000);
						}
					else if ((Number(args[0]) >= 100 && args[1] == "1-12") || (Number(args[0]) >= 100 && args[1] == "13-24") || (Number(args[0]) >= 100 && args[1] == "25-36")){
						var actCash = foundObj.retrocoinCash;
						var toPlay = Number(args[0]);
						var winner = "";
						var min = 1;
						var max = 36;
						if (actCash - toPlay < 0)
						 return message.channel.send(`У тебя разве хватает ${retricIcon} (ретриков) на такое действие?`);
						else {
							var newCash = actCash - toPlay
						}
						var r = Math.floor(Math.random() * (max - min + 1)) + min;
							if (((args[1] == "1-12") && (r >= 1 && r <= 12)) || ((args[1] == "13-24") && (r >= 13 && r <= 24)) || ((args[1] == "25-36") && (r >= 25 && r <= 36))){
								var won = toPlay * 2;
								var newCash = actCash + won;
							}
							message.channel.send({
								files: [{
									attachment: 'https://retrobotproject.herokuapp.com/images/roulette.gif',
									name: 'roulette.gif'
								}]
							}).then(msg => msg.delete(4000));



							foundObj.retrocoinCash = newCash;
							foundObj.retrocoinTotal = newCash + foundObj.retrocoinBank;
							foundObj.lastRoulette = Date.now();
							foundObj.save(function(err, updatedObj){
								if(err)
									console.log(err);
							});
							var toPay = Number(args[0])
							setTimeout(function(){
								var won = toPay * 3;
								if (((args[1] == "1-12") && (r >= 1 && r <= 12)) || ((args[1] == "13-24") && (r >= 13 && r <= 24)) || ((args[1] == "25-36") && (r >= 25 && r <= 36))){
									return message.reply(`вылетело ${r}!!! Ты только что выиграл ${won}${retricIcon}! Поздравляю ${bravoIcon}`);
								}
								else{
									message.reply(`увы, но вылетело ${r}! Видимо ${args[1]} - не твое ${pepeIcon}`);
									return message.channel.send({
										files: [{
											attachment: 'https://retrobotproject.herokuapp.com/images/roulette_loss.gif',
											name: 'roulette_loss.gif'
										}]
									}).then(msg => msg.delete(4000));
								}
							}, 4000);
						}
					else if (Number(args[0]) >= 100 && ((Number(args[1]) >= 1) && (Number(args[1]) <= 36))){
						var actCash = foundObj.retrocoinCash;
						var toPlay = Number(args[0]);
						var min = 1;
						var max = 36;
						if (actCash - toPlay < 0)
						 return message.channel.send(`У тебя разве хватает ${retricIcon} (ретриков) на такое действие?`);
						var r = Math.floor(Math.random() * (max - min + 1)) + min;
			  			if (r == Number(args[1])){
								var won = toPlay * 36;
								var newCash = actCash + won - toPlay;
							}
							else{
							var newCash = actCash - toPlay
						}
<<<<<<< HEAD
						message.channel.send({
							files: [{
								attachment: 'https://retrobotproject.herokuapp.com/images/roulette.gif',
								name: 'roulette.gif'
							}]
						}).then(msg => msg.delete(4000));



=======
>>>>>>> 21f88c57dc778cad129d65142ff13f3307d9d7b2
							foundObj.retrocoinCash = newCash;
							foundObj.retrocoinTotal = newCash + foundObj.retrocoinBank;
							foundObj.lastRoulette = Date.now();
							foundObj.save(function(err, updatedObj){
								if(err)
									console.log(err);
							});
							setTimeout(function(){
								if (r == Number(args[1])){
									var won = toPlay * 36
									return message.reply(`вылетело ${r}!!! Ты только что выиграл ${won}${retricIcon}! Поздравляю ${bravoIcon}`);
								}
								else{
									message.reply(`увы, но вылетело ${r}! Видимо ${args[1]} - не твое ${pepeIcon}`);
									return message.channel.send({
										files: [{
											attachment: 'https://retrobotproject.herokuapp.com/images/roulette_loss.gif',
											name: 'roulette_loss.gif'
										}]
									}).then(msg => msg.delete(4000));
								}
							}, 4000);
						}
				else if (Number(args[0]) < 100)
					return message.reply("минимальная ставка - 100 ретриков!");
				else
					return message.reply("чет не так... Набери ^roulette-info");
	});
}
else if (!args[0])
	return message.reply("укажи ставку и твой прогноз!");
else if (!args[1])
	return message.reply("укажи ставку и твой прогноз!");
else
	return message.reply("что-то явно пошло не так =)");
}

module.exports.help = {
	name: "roulette"
}
