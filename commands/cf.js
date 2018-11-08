const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');
var Item = require('./../schemas/shop_model.js');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

function random(min, max) {
	var result = Math.floor(Math.random() * (max - min + 1)) + min;
	return (result);
}

function playcf(user, toPlay, message){

	var user_obj = User.findOne({userID: message.member.id}, function(err, found_user){
		if (err)
			console.log("WTF there is an error: " + err);
		else {
			if (!user_obj)
				console.log("User not found");
			else {

				var chickenPower = 50;

				if (user.chickenPower && user.chickenPower != 0)
					chickenPower = user.chickenPower;

				var cfResult = random(1, 100);

				if (cfResult <= chickenPower){

					if (chickenPower < 75)
						chickenPower += 1;

					found_user.chickenPower = chickenPower;
					found_user.retrocoinCash += toPlay;


					message.channel.send({embed: {
						color: 1613918,
						title: `**Курочка выиграла и стала сильнее!**`,
						description: "Боевая мощь курочки (шанс выиграть) повышена: " + chickenPower +"%",
						timestamp: new Date(),
						footer: {
							icon_url: message.author.avatarURL,
							text: `© ${message.member.displayName}`
						},
					}});

				}
				else{

					found_user.retrocoinCash -= toPlay;
					found_user.chickenPower = 0;

					var index = user.inv.indexOf("Курочка 🐔");
					var newinv = user.inv;
					newinv.splice(index, 1);

					found_user.inv = newinv;

					message.channel.send({embed: {
						color: 14504004,
						title: `**Твоя курочка погибла!**`,
						timestamp: new Date(),
						footer: {
							icon_url: message.author.avatarURL,
							text: `© ${message.member.displayName}`
						},
					}});
				}
				found_user.lastCF = Date.now();
				found_user.save(function(err, updatedObj){
				if (err)
					console.log(err);
				});
			}
		}
	});
}

module.exports.run = async (bot, message, args) => {

	//message.delete().catch(O_o=>{});

	var casino_channel = message.guild.channels.find(`name`, "🎰казино_экономика");

	if (message.channel.name != "🎰казино_экономика" && message.channel.name != "🌎general_bots"){
		message.delete(3000);
    	return message.reply(`в курочку можно играть только в ${casino_channel}`).then(msg => msg.delete(10000));
    }

	var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});

	if (typeof user_obj === 'undefined' || user_obj === null)
		return message.reply("пользователь не найден в базе");

	//чекаем есть ли у него Курочка в инвентаре

	if (user_obj.inv.includes("Курочка 🐔") == false)
		return message.reply("у тебя нету 🐔");

	//чекаем играл ли человек недавно в курочку

	if (user_obj.lastCF){

		var dateTime = Date.now();
		var timestamp = Math.floor(dateTime/1000);
		var timestampLimit = Math.floor(user_obj.lastCF/1000) + 15;

		if (timestampLimit > timestamp)
			return message.reply(`твоя курочка только-только подралась! Дай ей чуть передохнуть :thinking:`);
	}

	//чекаем сделал ли типуля ставку и достаточно ли у него денег в базе

	if (args[0] && isNumeric(args[0]) == true){

		let toPlay = Number(args[0]);
		if (toPlay >= 100){
			if ((user_obj.retrocoinCash - toPlay) >= 0){
				message.channel.send({
					files: [{
						attachment: 'https://retrobotproject.herokuapp.com/images/chicken.gif',
						name: 'chicken.gif'
					}]
				}).then(msg => msg.delete(4000));
				setTimeout(function(){
					playcf(user_obj, toPlay, message)
				}, 5000);
				return;
			}
			else{
				return message.reply("у тебя не хватит на это ретриков!");
			}
		}
		else{
			return message.reply("минимальная стака - 100 ретриков!");
		}
	}
	return message.reply("нужно сделать ставку, от 100 ретриков и выше!")
}

module.exports.help = {
	name: "cf"
}
