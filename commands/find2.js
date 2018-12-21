const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

function random(min, max) {
	var result = Math.floor(Math.random() * (max - min + 1)) + min;
	return (result);
}

function isNumeric(value) {
	return /^\d+$/.test(value);
}

module.exports.run = async (bot, message, args) => {

	if (message.member.voiceChannel){

		message.member.voiceChannel.createInvite().then(invite => function(){
			console.log(`Created an invite with a code of ${invite.code}`);
		}).catch(console.error);

		// .then(inv => function(inv){
		// 	var invitation = inv.toString();
		// 	console.log("Invitation link is: " + invitation);
		// 	message.reply(`Invitation: ${invitation}`);
		// }).catch(function(error){
		// 	console.log(error);
		// });
	}
	else{
		message.reply("no voiceChannel detected");
	}
}

module.exports.help = {
  name: "find2"
}
