const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

function random(min, max) {
	var result = Math.floor(Math.random() * (max - min + 1)) + min;
	return (result);
}

function isNumeric(value) {
	return /^\d+$/.test(value);
}

// function sendToPn(age, gameName, vchannel, userComment){
//   var pnchannel = message.guild.channels.find(`name`, "👋поиск_напарников");
//
//   const embed = new Discord.RichEmbed()
//   .setTitle(`${message.member.displayName} ищет себе напарника.`)
//   .setColor("#35885C")
//   .addField("Возраст:", age, true)
//   .addField("Игра:", gameName, true)
//   .addField("Голосовая комната:", vchannel, true)
//   .addField("Комментарий:", userComment, true)
//
//   pnchannel.send({embed});
// }

module.exports.run = async (bot, message, args) => {

	var filter = m => m.author.id === message.member.id;

	if (message.member == null)
		return;

	message.delete().catch(O_o=>{});

	var dmChannel = message.member.createDM().then(function(dmChannel){
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
					var dateTime = Date.now();
					if(!foundObj.lastFind){
						firstdate = Math.floor(dateTime/1000) - 300;
						foundObj.lastFind = Math.floor(firstdate*1000);
						console.log(`Юзеру ${message.member.displayName} обновлен lastFind`);
					}
					if(!foundObj.findOpen){
						foundObj.findOpen = false;
					}
					var timestamp = Math.floor(dateTime/1000);
					var timestampLimit = Math.floor(foundObj.lastFind/1000) + 300;

					if (timestampLimit <= timestamp && foundObj.findOpen == false){
						foundObj.findOpen = true;
						dmChannel.send(`Чтобы найти себе напарника для игры в PVE ответь, пожалуйста, на несколько вопросов.`);
						dmChannel.send(`Сколько тебе лет?`);
						//--------------------------------------------//
						dmChannel.awaitMessages(filter, {
						  max: 1,
						  time: 300000
						}).then(collected => {
						  var age = collected.first().content;
						  if (isNumeric(age)) {
						    dmChannel.send(`Введи номер локации на которой вы хотите сыграть:`);
								dmChannel.send(`1 - **Камнелесье**,2 - **Планкертон**,3 - **Вещая далина**,4 - **Линч-Пикс**`);
						    //--------------------------------------------//
						    dmChannel.awaitMessages(filter, {
						      max: 1,
						      time: 300000
						    }).then(collected => {
						      var gamenum = collected.first().content;
									if(gamenum == "1"){
										var embedcolor = "#2DA3FF";
										var gamename = "Камнелесье";

									}else if(gamenum == "2"){
										var embedcolor = "#FFB30F";
										var gamename = "Планкертон";

									}else if(gamenum == "3"){
										var embedcolor = "#DB2219";
										var gamename = "Вещая далина";

									}else if(gamenum == "4"){
										var embedcolor = "#464646";
										var gamename = "Линч-Пикс";

									}else{
										foundObj.findOpen = false;
										dmChannel.send(`Попробуй еще раз. Нужно ввести номер локации от 1 до 4.`);
										return foundObj.save(function(err, updatedObj){if(err)console.log(err)});
									}
									var img = random(1,3);
									var img = `https://retrobotproject.herokuapp.com/images/PVE${img}.png`;

									dmChannel.send(`Твой комментарий:`);
									dmChannel.awaitMessages(filter, {
										max: 1,
										time: 300000
									}).then(collected => {
										if (message.member.voiceChannel){
											var comment = collected.first().content;
											var pnchannel = message.guild.channels.find(`name`, "🌍pve_напарники");
											var userAvatar = message.member.user.avatarURL;
											const embed = new Discord.RichEmbed()
											.setTitle(`${message.member.displayName} ищет напарников!`)
											.setColor(embedcolor)
											.addField("Возраст:", age, true)
											.addField("Локация:", gamename, true)
											.addField("Голосовой канал:", message.member.voiceChannel.name, true)
											.addField("Комментарий:", comment, true)
											.addField("Ник:", `<@${message.member.id}>`, true)
											.setThumbnail(img)
											pnchannel.send({embed});
										}
										else{
											var comment = collected.first().content;
											var pnchannel = message.guild.channels.find(`name`, "👋поиск_напарников");
											var userAvatar = message.member.user.avatarURL;
											const embed = new Discord.RichEmbed()
											.setTitle(`${message.member.displayName} ищет напарников!`)
											.setColor(embedcolor)
											.addField("Возраст:", age, true)
											.addField("Локация:", gamename, true)
											.addField("Голосовой канал:", "-", true)
											.addField("Комментарий:", comment, true)
											.addField("Ник:", `<@${message.member.id}>`, true)
											.setThumbnail(img)
											pnchannel.send({embed});
										}

										dmChannel.send(`Твое сообщение отправлено! Жди своих будущих напарников!`);
										foundObj.lastFind = Date.now();
										foundObj.findOpen = false;
										foundObj.save(function(err, updatedObj){
										if(err)
											console.log(err);
										});
									}).catch(err => {
										foundObj.findOpen = false;
										dmChannel.send("Время вышло, ты не ответил на вопрос!");
										foundObj.save(function(err, updatedObj){if(err)console.log(err)});
									});
						    }).catch(err => {
									foundObj.findOpen = false;
						      dmChannel.send("Время вышло, ты не ответил на вопрос!");
									foundObj.save(function(err, updatedObj){if(err)console.log(err)});
						    });
						  }
						  else{
								foundObj.findOpen = false;
								dmChannel.send("Введи число!");
								foundObj.save(function(err, updatedObj){if(err)console.log(err)});
						  }
						}).catch(err => {
							foundObj.findOpen = false;
						  dmChannel.send("Время вышло, ты не ответил на вопрос!");
							foundObj.save(function(err, updatedObj){if(err)console.log(err)});
						});
					}
					else if(timestampLimit <= timestamp && foundObj.findOpen == true) {
							dmChannel.send("У тебя уже открыта анкета!");
					}
					else {
						dmChannel.send("Ты можешь искать напарников только раз в 5 минут! Подожди еще немного и к тебе непременно кто-то зайдет!");
					}
				}
			}
		});
	}).catch(function(error){
		console.log(error);
	});
}

module.exports.help = {
  name: "find"
}
