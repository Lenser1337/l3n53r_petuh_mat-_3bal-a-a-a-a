const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

//	message.delete().catch(O_o=>{});

	message.channel.send("Приглашение на наш сервер:\nhttps://discord.gg/yfuCWAA\n\nРаскидывай всем своим друганам! :)");
}


module.exports.help = {
	name: "in"
}