const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  message.delete().catch(O_o=>{});

	let bicon = bot.user.avatarURL;
	const embed = new Discord.RichEmbed()
	.setTitle("ИНФОРМАЦИЯ О БОТЕ")
	.setColor("#4C8BF5")
	.setThumbnail(bicon)
	.addField("Ник бота:", bot.user.username, true)
	.addField("Версия бота:", "1.0.5", true)
	.addField("Бот создан:", bot.user.createdAt, true)
	.addField("Bot developers:", "@Jerry Smith#6666, @Rick Sanchez#6666 и @Dalas#8328", true)

	message.channel.send({embed});
}

module.exports.help = {
	name: "botinfo"
}
