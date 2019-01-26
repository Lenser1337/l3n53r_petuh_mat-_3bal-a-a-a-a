const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {

	var retricIcon = bot.emojis.find("name", "retric");

	let toScan = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

	if(toScan && toScan.roles.some(r=>["Бездушные"].includes(r.name)))
		return;

  if (message.channel.id == "478537473480458251" || message.channel.id == "383183498737090571")
    return	message.delete().catch(O_o=>{});

	if(!toScan){
		var user_obj = User.findOne({
			userID: message.member.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj){
					console.log("User not found in database");
					return;
				}

				var bank = foundObj.retrocoinBank;

				if (bank === Infinity){
					bank = "реально дофига";
				}

        var protectionStatus = "";

        if (foundObj.protection){
          if {
            var dateTime = Date.now();
            var timestamp = Math.floor(dateTime/1000);
            var timestampLimit = Math.floor(foundObj.protection/1000);

            if (timestampLimit > timestamp)
              protectionStatus = "активирован :shield:";
          }
        }
        else{
          protectionStatus = "не активен :red_circle:";
        }

				var avatar = message.member.user.avatarURL;
				var total = foundObj.retrocoinCash + foundObj.retrocoinBank;
				const embed = new Discord.RichEmbed()
				.setTitle("Личный счет " + message.member.displayName)
				.setColor("#0000FF")
				.addField("Наличкой", `${numberWithCommas(foundObj.retrocoinCash)} ${retricIcon}`, true)
				.addField("В банке", `${numberWithCommas(bank)} ${retricIcon}`, true)
				.setThumbnail(avatar)
        .setFooter("Иммунитет: ", protectionStatus)

				message.channel.send({embed});
			}
		});
	} else {
		var user_obj = User.findOne({
			userID: toScan.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (foundObj === null)
					return;

				var bank = foundObj.retrocoinBank;

				if (bank === Infinity){
					bank = "реально дофига";
				}

        var protectionStatus = "";

        if (foundObj.protection){
          if {
            var dateTime = Date.now();
            var timestamp = Math.floor(dateTime/1000);
            var timestampLimit = Math.floor(foundObj.protection/1000);

            if (timestampLimit > timestamp)
              protectionStatus = "активирован :shield:";
          }
        }
        else{
          protectionStatus = "не активен :red_circle:";
        }

				var avatar = toScan.user.avatarURL;
				var total = foundObj.retrocoinCash + foundObj.retrocoinBank;
				const embed = new Discord.RichEmbed()
				.setTitle("Личный счет " + toScan.displayName)
				.setColor("#0000FF")
				.addField("Наличкой", `${numberWithCommas(foundObj.retrocoinCash)} ${retricIcon}`, true)
				.addField("В банке", `${numberWithCommas(bank)} ${retricIcon}`, true)
				.setThumbnail(avatar)
        .setFooter("Иммунитет: ", protectionStatus)

				message.channel.send({embed});
			}
		});
	}
}


module.exports.help = {
	name: "bal"
}
