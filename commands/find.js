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

	if (message.member.voiceСhannel){
		console.log("DB1");
		var voiceСhannel = message.member.voiceChannel.name;
	} else {
		console.log("DB2");
		var voiceСhannel = "-";
	}

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
						dmChannel.send(`Чтобы найти себе напарника ответь пожалуйста на несколько вопросов.`);
						dmChannel.send(`Сколько тебе лет?`);
						//--------------------------------------------//
						dmChannel.awaitMessages(filter, {
						  max: 1,
						  time: 300000
						}).then(collected => {
						  var age = collected.first().content;
						  if (isNumeric(age)) {
						    dmChannel.send(`Введи номер игры в которую ты хочешь играть:`);
								dmChannel.send(`1 - **Fortnite**, 2 - **Overwatch**, 3 - **Roblox**, 4 - **CS:GO**, 5 - **Dota 2**, 6 - **League of Legends**, 7 - **Desteny 2**, 8 - **GTA 5**, 9 - **Minecraft**`);
						    //--------------------------------------------//
						    dmChannel.awaitMessages(filter, {
						      max: 1,
						      time: 300000
						    }).then(collected => {
						      var gamenum = collected.first().content;
									if(gamenum == "1"){
										var img = "https://retrobotproject.herokuapp.com/images/fortnite.jpg";
										var embedcolor = "#2DA3FF";
										var gamename = "Fortnite";

									}else if(gamenum == "2"){
										var img = "https://retrobotproject.herokuapp.com/images/ower.jpg";
										var embedcolor = "#FFB30F";
										var gamename = "Overwatch";

									}else if(gamenum == "3"){
										var img = "https://retrobotproject.herokuapp.com/images/roblox.jpg";
										var embedcolor = "#DB2219";
										var gamename = "Roblox";

									}else if(gamenum == "4"){
										var img = "https://retrobotproject.herokuapp.com/images/csgo.png";
										var embedcolor = "#464646";
										var gamename = "CS:GO";

									}else if(gamenum == "5"){
										var img = "https://retrobotproject.herokuapp.com/images/dota2.jpg";
										var embedcolor = "#AA2F17";
										var gamename = "Dota 2";

									}else if(gamenum == "6"){
										var img = "https://retrobotproject.herokuapp.com/images/lol.jpg";
										var embedcolor = "#004384";
										var gamename = "League of Legends";

									}else if(gamenum == "7"){
										var img = "https://retrobotproject.herokuapp.com/images/desteny2.jpg";
										var embedcolor = "#D9C9A9";
										var gamename = "Desteny 2";

									}else if(gamenum == "8"){
										var img = "https://retrobotproject.herokuapp.com/images/gta5.jpg";
										var embedcolor = "#0F912C";
										var gamename = "GTA 5";

									}else if(gamenum == "9"){
										var img = "https://retrobotproject.herokuapp.com/images/minecraft.jpg";
										var embedcolor = "#04B944";
										var gamename = "Minecraft";

									}else{
										foundObj.findOpen = false;
										dmChannel.send(`Попробуй еще раз. Нужно ввести номер игры от 1 до 9.`);
										return foundObj.save(function(err, updatedObj){if(err)console.log(err)});
									}

									dmChannel.send(`Твой комментарий:`);
									dmChannel.awaitMessages(filter, {
										max: 1,
										time: 300000
									}).then(collected => {
										var comment = collected.first().content;
										var pnchannel = message.guild.channels.find(`name`, "👋поиск_напарников");
										var userAvatar = message.member.user.avatarURL;
										const embed = new Discord.RichEmbed()
										.setTitle(`${message.member.displayName} ищет напарников!`)
										.setColor(embedcolor)
										.addField("Возраст:", age, true)
										.addField("Во что играем:", gamename, true)
										.addField("Голосовой канал:", voiceСhannel, true)
										.addField("Комментарий:", comment, true)
										.addField("Ник:", `<@${message.member.id}>`, true)
										.setThumbnail(img)

										pnchannel.send({embed});
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
