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

	var avatar = message.member.user.avatarURL;
	var retricIcon = bot.emojis.find("name", "retric");

	if (message.channel.id == "478537473480458251" || message.channel.id == "383183498737090571")
    return message.delete().catch(O_o=>{});

	if (args[0] === "all"){
		var user_obj = User.findOne({
			userID: message.member.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj)
					console.log("Something stange happend");
				else {
					if (foundObj.retrocoinCash == 0){
						return message.reply("чеееее :thinking: У тебя нету ретриков на руках!");
					}
					var actBank = foundObj.retrocoinBank;
					var actCash = foundObj.retrocoinCash;
					var newBank = actCash + actBank;

					foundObj.retrocoinCash = 0;
					foundObj.retrocoinBank = newBank;
					foundObj.retrocoinTotal = newBank;
					foundObj.save(function(err, updatedObj){
						if(err)
							console.log(err);
					})

					var avatar = message.member.user.avatarURL;
					var total = foundObj.retrocoinCash + foundObj.retrocoinBank;

					var protectionStatus = "";
					var iconUrl = "";
					var red = "https://cdn.discordapp.com/emojis/518146544432840725.png?v=1";
					var green = "https://cdn.discordapp.com/emojis/518146532713955328.png?v=1";

					if (foundObj.protection){
							var dateTime = Date.now();
							var timestamp = Math.floor(dateTime/1000);
							var timestampLimit = Math.floor(foundObj.protection/1000);
							if (timestampLimit > timestamp){
								protectionStatus = "иммунитет активирован!";
								iconUrl = green;
							}
					}
					else{
						if(message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name))){
							protectionStatus = "иммунитет активирован!";
							iconUrl = green;
						}
						else{
							protectionStatus = "иммунитет не активен";
							iconUrl = red;
						}
					}

					const embed = new Discord.RichEmbed()
					.setTitle(`Все ретрики были переведены в банк! Новый баланс ` + message.member.displayName)
					.setColor("#0000FF")
					.setThumbnail(avatar)
					.addField("Наличкой", `${numberWithCommas(foundObj.retrocoinCash)} ${retricIcon}  `, true)
					.addField("В банке", `${numberWithCommas(foundObj.retrocoinBank)} ${retricIcon}  `, true)
					.setFooter(protectionStatus, iconUrl)

					message.channel.send({embed});
				}
			}
		});
	}
	else if (isNumeric(args[0])){
		var user_obj = User.findOne({
			userID: message.member.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj)
					console.log("Something stange happend");
				else {
					var actBank = foundObj.retrocoinBank;
					var actCash = foundObj.retrocoinCash;
					var toDep = Number(args[0]);
					var newBank = actBank + toDep;
					var newCash = actCash - toDep;
					if (newCash >= 0){
						foundObj.retrocoinCash = newCash;
						foundObj.retrocoinBank = newBank;
						foundObj.retrocoinTotal = newBank + newCash;
						foundObj.save(function(err, updatedObj){
							if(err)
								console.log(err);
						})
						var avatar = message.member.user.avatarURL;
						var total = foundObj.retrocoinCash + foundObj.retrocoinBank;

						var protectionStatus = "";
						var iconUrl = "";
						var red = "https://cdn.discordapp.com/emojis/518146544432840725.png?v=1";
						var green = "https://cdn.discordapp.com/emojis/518146532713955328.png?v=1";

						if (foundObj.protection){
								var dateTime = Date.now();
								var timestamp = Math.floor(dateTime/1000);
								var timestampLimit = Math.floor(foundObj.protection/1000);
								if (timestampLimit > timestamp){
									protectionStatus = "иммунитет активирован!";
									iconUrl = green;
								}
						}
						else{
							if(message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name))){
								protectionStatus = "иммунитет активирован!";
								iconUrl = green;
							}
							else{
								protectionStatus = "иммунитет не активен";
								iconUrl = red;
							}
						}

						const embed = new Discord.RichEmbed()
						.setTitle(toDep + " ретриков переведено в банк! Новый баланс " + message.member.displayName)
						.setColor("#0000FF")
						.setThumbnail(avatar)
						.addField("Наличкой", `${numberWithCommas(foundObj.retrocoinCash)} ${retricIcon}  `, true)
						.addField("В банке", `${numberWithCommas(foundObj.retrocoinBank)} ${retricIcon}  `, true)
						.setFooter(protectionStatus, iconUrl)

						message.channel.send({embed});
					}
					else {
						return message.channel.send(`У тебя разве хватает ${retricIcon} (ретриков) на такое действие? :thinking:`);
					}
				}
			}
		});
	}
	else
		return message.reply("чеееее :thinking:");
}

module.exports.help = {
	name: "dep"
}
