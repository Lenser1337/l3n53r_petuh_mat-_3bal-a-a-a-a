const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sort_inv(inv) {
	var a = [], b = [], prev;

	inv.sort();
	for ( var i = 0; i < inv.length; i++ ) {
		if ( inv[i] !== prev ) {
			a.push(inv[i]);
			b.push(1);
		} else {
			b[b.length-1]++;
		}
		prev = inv[i];
	}
	return [a, b];
}

module.exports.run = async (bot, message, args) => {

	var retricIcon = bot.emojis.find("name", "retric");

	let toScan = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

	if (toScan && !message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name)))
		return message.reply("в чужой карман заглянуть нельзя!");

	if(!toScan){

		var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});

		if (typeof user_obj === 'undefined' || user_obj === null)
			return message.reply("пользователь не найден в базе");
		if (!user_obj.inv)
			return message.reply("твой инвентарь пуст!");
		var inventory_magic = sort_inv(user_obj.inv);
		var	inventoryNames = inventory_magic[0];
		var inventoryCount = inventory_magic[1];

		var maxX = inventoryNames.length;
		var x = 0;
		var y = 0;
		var text = ``;

		if (maxX == 0)
			return message.reply("твой инвентарь пуст!");

		while(x < maxX)
			text += `**${y=x+1}.** ${inventoryNames[x]} • **${numberWithCommas(inventoryCount[x++])}**\n`;

		var min = 0;
		var max = 16777215;
		var randomColor = Math.floor(Math.random() * (max - min + 1)) + min;

		message.channel.send({embed: {
			color: randomColor,
			title: `**${user_obj.displayName}** :shopping_cart: **инвентарь**`,
			fields: [
			{
				name: "(все что ты успел у нас закупить)",
				value: text
			}
			],
			timestamp: new Date(),
			footer: {
				icon_url: message.author.avatarURL,
				text: `© ${message.member.displayName}`
			},
		}});
	} else {

		var user_obj = await User.findOne({userID: toScan.id}, function(err, found_user){});

		if (typeof user_obj === 'undefined' || user_obj === null)
			return message.reply("пользователь не найден в базе");

		var inventory_magic = sort_inv(user_obj.inv);
		var	inventoryNames = inventory_magic[0];
		var inventoryCount = inventory_magic[1];

		var maxX = inventoryNames.length;
		var x = 0;
		var y = 0;
		var text = ``;

		while(x < maxX)
			text += `**${y=x+1}.** ${inventoryNames[x]} • **${numberWithCommas(inventoryCount[x++])}**\n`;

		var min = 0;
		var max = 16777215;
		var randomColor = Math.floor(Math.random() * (max - min + 1)) + min;

		message.channel.send({embed: {
			color: randomColor,
			title: `**${user_obj.displayName}** :shopping_cart: **инвентарь**`,
			fields: [
			{
				name: "(все что ты успел у нас закупить)",
				value: text
			}
			],
			timestamp: new Date(),
			footer: {
				icon_url: message.author.avatarURL,
				text: `© ${message.member.displayName}`
			},
		}});
	}
}


module.exports.help = {
	name: "inv"
}
