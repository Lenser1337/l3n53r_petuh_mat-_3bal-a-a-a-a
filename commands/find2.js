const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

	if (message.member == null)
		return;

	if (message.member.voiceСhannel){
		console.log("DB1");
    console.log("channel name: " + message.member.voiceChannel.name);
	} else {
		console.log("DB2");
	}
}

module.exports.help = {
  name: "find2"
}
