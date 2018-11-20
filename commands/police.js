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
					if(!foundObj.resetedwarns)
					  var newresetedwarns = 0;
					else {
						var newresetedwarns = foundObj.resetedwarns;
					}
					if(!foundObj.resetedinfractions)
					var newresetedinfractions = 0;
					else {
						var newresetedinfractions = foundObj.resetedinfractions;
					}
					if(!foundObj.resetedmutes)
					var newresetedmutes = 0;
					else {
						var newresetedmutes = foundObj.resetedmutes;
					}
					if(!foundObj.resetedvoicemutes)
					var newresetedvoicemutes = 0;
					else {
						var newresetedvoicemutes = foundObj.resetedvoicemutes;
					}
					var avatar = toScan.user.avatarURL;
					if (!foundObj.resetedwarns || !foundObj.resetedinfractions || !foundObj.resetedmutes || !foundObj.resetedvoicemutes){
						var myData = new User({
							moder: foundObj.moder,
							moderID: foundObj.moderID,
							warnsAmount: foundObj.warnsAmount,
							infractionsAmount: foundObj.infractionsAmount,
							muteAmount: foundObj.muteAmount,
							voicemuteAmount: foundObj.voicemuteAmount,
							resetedwarns: newresetedwarns,
							resetedinfractions: newresetedinfractions,
							resetedmutes: newresetedmutes,
							resetedvoicemutes: newresetedvoicemutes,
						});
						myData.save()
					}

					const embed = new Discord.RichEmbed()
					.setTitle(`${toScan.displayName}`)
					.setColor("#0000FF")
					.addField(`Выдал(а) варнов`, `${foundObj.warnsAmount} (${foundObj.resetedwarns})`, true)
					.addField(`Выдал(а) предупреждений`, `${foundObj.infractionsAmount} (${foundObj.resetedinfractions})`, true)
					.addField(`Выдал(а) мутов`, `${foundObj.muteAmount} (${foundObj.resetedmutes})`, true)
					.addField(`Выдал(а) войс мутов`, `${foundObj.voicemuteAmount} (${foundObj.resetedvoicemutes})`, true)
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
