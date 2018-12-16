const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

	if (message.member == null)
		return;

	if (message.member.voiceСhannel){
		console.log("DB1");
    message.channel.send("voiceChannel name: " + message.member.voiceChannel.name);
	} else {
		console.log("DB2");
    message.channel.send("not in voice!");
	}
}

module.exports.help = {
  name: "find2"
}
