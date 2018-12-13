const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
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
  message.delete().catch(O_o=>{});

	var filter = m => m.author.id === message.member.id;
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
						foundObj.lastFind = Math.floor(dateTime/1000);
						console.log(`Юзеру ${message.member.displayName} обновлен lastFind`);
					}
					var timestamp = Math.floor(dateTime/1000);
					var timestampLimit = Math.floor(foundObj.lastFind/1000) + 300;

					if (timestampLimit < timestamp){

						dmChannel.send(`Чтобы найти себе напарника ответь пожалуйста на несколько вопросов.`);
						dmChannel.send(`Сколько тебе лет?`);
						//--------------------------------------------//
						dmChannel.awaitMessages(filter, {
						  max: 1,
						  time: 300000
						}).then(collected => {
						  var age = collected.first().content;
						  if (isNumeric(age) && age <= 80) {
						    dmChannel.send(`Введи номер игры в которую ты хочешь играть`);
								dmChannel.send(`1 - Fortnite, 2 - Owerwatch, 3 - Roblox, 4 - CS:GO, 5 - Dota 2, 6 - League of Legends, 7 - Desteny 2, 8 - GTA 5, 9 - Minecraft.`);
						    //--------------------------------------------//
						    dmChannel.awaitMessages(filter, {
						      max: 1,
						      time: 300000
						    }).then(collected => {
						      var game = collected.first().content;

									if(game == "1"){
										var img = new Image();
										img.src = "https://retrobotproject.herokuapp.com/images/fortnite.jpg";
										var embedcolor = "#2DA3FF";

									}else if(game == "2"){
										var img = new Image();
										img.src = "https://retrobotproject.herokuapp.com/images/ower.jpg";
										var embedcolor = "#FFB30F";

									}else if(game == "3"){
										var img = new Image();
										img.src = "https://retrobotproject.herokuapp.com/images/roblox.jpg";
										var embedcolor = "#DB2219";

									}else if(game == "4"){
										var img = new Image();
										img.src = "https://retrobotproject.herokuapp.com/images/csgo.png";
										var embedcolor = "#464646";

									}else if(game == "5"){
										var img = new Image();
										img.src = "https://retrobotproject.herokuapp.com/images/dota2.jpg";
										var embedcolor = "#AA2F17";

									}else if(game == "6"){
										var img = new Image();
										img.src = "https://retrobotproject.herokuapp.com/images/lol.jpg";
										var embedcolor = "#004384";

									}else if(game == "7"){
										var img = new Image();
										img.src = "https://retrobotproject.herokuapp.com/images/desteny2.jpg";
										var embedcolor = "#D9C9A9";

									}else if(game == "8"){
										var img = new Image();
										img.src = "https://retrobotproject.herokuapp.com/images/gta5.jpg";
										var embedcolor = "#0F912C";

									}else if(game == "9"){
										var img = new Image();
										img.src = "https://retrobotproject.herokuapp.com/images/minecraft.jpg";
										var embedcolor = "#04B944";

									}else{
										return dmChannel.send(`Попробуй еще раз. Нужно ввести номер игры от 1 до 9.`);
									}
									dmChannel.send(`В каком голосовом канале тебя можно найти?`);
						      //--------------------------------------------//
						      dmChannel.awaitMessages(filter, {
						        max: 1,
						        time: 300000
						      }).then(collected => {
						        var voiceСhannel = collected.first().content;
						        //--------------------------------------------//
						        dmChannel.send(`Твой комментарий:`);
						        dmChannel.awaitMessages(filter, {
						          max: 1,
						          time: 300000
						        }).then(collected => {
						          var comment = collected.first().content;

						          var pnchannel = message.guild.channels.find(`name`, "👋поиск_напарников");
						          var userAvatar = message.member.user.avatarURL;

						          const embed = new Discord.RichEmbed()
						          .setTitle(`${message.member.displayName} ищет себе напарника.`)
						          .setColor(embedcolor)
						          .addField("Возраст:", age, true)
						          .addField("Игра:", game, true)
						          .addField("Голосовая комната:", voiceСhannel, true)
						          .addField("Комментарий:", comment, true)
						          .addField("Ник:", `<@${message.member.id}>`, true)
						          .setThumbnail(img)

						          pnchannel.send({embed});
						          dmChannel.send(`Твое сообщение отправлено! Жди своих будущих напарников!`);
											foundObj.lastFind = dateTime;
						          //--------------------------------------------//
						        }).catch(err => {
						          dmChannel.send("Время вышло! Ты не ответил на вопрос 4.");
						        });
						      }).catch(err => {
						        dmChannel.send("Время вышло! Ты не ответил на вопрос 3.");
						      });
						    }).catch(err => {
						      dmChannel.send("Время вышло! Ты не ответил на вопрос 2.");
						    });
						  }
						  else{
						    if(age <= 80) {
									dmChannel.send("Эээ! Ты не такой старый!");
								}
								else{
									dmChannel.send("Введи число!");
								}
						  }
						}).catch(err => {
						  dmChannel.send("Время вышло! Ты не ответил на вопрос 1.");
						});
					}
					else {
						dmChannel.send("Ты можешь искать напарников только раз в 5 минут! Подожди еще немного и тебе непременно кто то напишет.");
					}

					foundObj.save(function(err, updatedObj){
					if(err)
						console.log(err);
					});
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
