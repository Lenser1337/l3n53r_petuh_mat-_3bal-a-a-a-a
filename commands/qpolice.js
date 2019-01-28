const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/qreport_model.js');

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {

	if(!message.member.roles.some(r=>["Тех. Администратор", "Главный редактор", "Губернатор", "Комиссар"].includes(r.name)))
		return;

	let toScan = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

	if(toScan && toScan.roles.some(r=>["Бездушные"].includes(r.name)))
		return;

	if (!toScan)
		return message.reply("укажи кого-то!");

	message.delete().catch(O_o=>{});

	if(toScan){
		var user_obj = User.findOne({
			userID: toScan.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj){
					console.log("User not found in database");
					return message.reply('этот пользователь еще не модерировал на сервере');
				}
				else {
					if(foundObj.q == null ||typeof foundObj.resetedq == "undefined")
					foundObj.q = 0;

					if(foundObj.resetedq == null ||typeof foundObj.resetedq == "undefined")
					foundObj.resetedq = 0;

					foundObj.save(function(err, updatedObj){
						if(err)
							console.log(err);
					});

					var avatar = toScan.user.avatarURL;
					const embed = new Discord.RichEmbed()
					.setTitle(`${toScan.displayName}`)
					.setColor("#0000FF")
					.addField(`Задал(а) вопросов`, `${foundObj.q} (${foundObj.resetedq})`, true)
					.setThumbnail(avatar)

					message.channel.send({embed});
				}
			}
		});
	}
}

module.exports.help = {
	name: "qpolice"
}
