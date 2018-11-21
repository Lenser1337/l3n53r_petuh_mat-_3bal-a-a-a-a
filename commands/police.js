const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/report_model.js');

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {

	if(!message.member.roles.some(r=>["Тех. Администратор", "Тех. Стажер", "Комиссар полиции", "Шериф"].includes(r.name)))
		return;

	let toScan = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

	if(toScan && toScan.roles.some(r=>["Бездушные"].includes(r.name)))
		return;

	if (!toScan)
		return message.reply("укажи кого-то!");

	message.delete().catch(O_o=>{});

	if(toScan){
		var user_obj = User.findOne({
			moderID: toScan.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj){
					console.log("User not found in database");
					return message.reply('этот пользователь еще не модерировал на сервере');
				}
				else {

					if (typeof foundObj.resetedwarns == 'undefined')
						var resetedwarns = 0;
					else
						var resetedwarns = foundObj.resetedwarns;

					if (typeof foundObj.resetedinfractions == 'undefined')
						var resetedinfractions = 0;
					else
						var resetedinfractions = foundObj.resetedinfractions;

					if (typeof foundObj.resetedmutes == 'undefined')
						var resetedmutes = 0;
					else
						var resetedmutes = foundObj.resetedmutes;

					if (typeof foundObj.resetedvoicemutes == 'undefined')
						var resetedvoicemutes = 0;
					else
						var resetedvoicemutes = foundObj.resetedvoicemutes;

					const embed = new Discord.RichEmbed()
					.setTitle(`${toScan.displayName}`)
					.setColor("#0000FF")
					.addField(`Выдал(а) варнов`, `${foundObj.warnsAmount} (${resetedwarns})`, true)
					.addField(`Выдал(а) предупреждений`, `${foundObj.infractionsAmount} (${resetedinfractions})`, true)
					.addField(`Выдал(а) мутов`, `${foundObj.muteAmount} (${resetedmutes})`, true)
					.addField(`Выдал(а) войс мутов`, `${foundObj.voicemuteAmount} (${resetedvoicemutes})`, true)
					.setThumbnail(avatar)

					message.channel.send({embed});
				}
			}
		});
	}
}

module.exports.help = {
	name: "police"
}
