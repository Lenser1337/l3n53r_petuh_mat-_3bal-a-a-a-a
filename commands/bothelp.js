const Discord = require("discord.js");

//help

module.exports.run = async (bot, message, args) => {

	let cnchannel = message.guild.channels.find(`name`, "👥черный_рынок");
	let pchannel = message.guild.channels.find(`name`, "📌правила");
	let kchannel = message.guild.channels.find(`name`, "📵канализация");
	let pnchannel = message.guild.channels.find(`name`, "👋поиск_напарников");

	message.delete().catch(O_o=>{});

	let bicon = bot.user.avatarURL;
	const embed = new Discord.RichEmbed()
	.setTitle(":star:Доступные на данный момент команды:star:")
	.setColor("#BF44FF")
	.setThumbnail(bicon)
	.addField("^addrole роль", "Добавляет роль, доступна админу", true)
	.addField("^ban", "Тут и ежу ясно", true)
	.addField("^botinfo", "Информация о боте (можем написать что захотим)", true)
	.addField("^kick", "И тут все понятно", true)
	.addField("^removerole роль", "Удаляет роль, доступна админу", true)
	.addField("^report user причина", "Отправляет жалобу в скрытый канал", true)
	.addField("^serverinfo", "Информация о сервере, можем показывать что захотим но солгать в цифрах не сможем", true)
	.addField("^tempmute user Xs/m/h/d", "Мут на X времени", true)
	.addField("^unmute", "Тут все логично...", true)
	.addField("^voicemute user Xs/m/h/d", "Мут микрофона на X времени", true)
	.addField("^voiceunmute", "Анмут микрофона преждевременно", true)
	.addField("^warn user reason", "Варны, сами опробуете, накопительная система", true)
	.addField("^unban", "Попробуйте сами угадать", true)
	.addField("^clear X", "Удалить последние Х сообщений с чата (от 2 до 100)", true)
	.addField("^pn", `Посылает игрока в ${pnchannel}`, true)
	.addField("^4r", `Посылает игрока в ${cnchannel}`, true)
	.addField("^mat", "Говорит пользователю, что мат запрещен", true)
	.addField("^pop", "Говорит пользователю, что попрошайничество запрещено", true)
	.addField("^sp", "Говорит пользователю, что спам запрещен", true)
	.addField("^mk", "Говорит пользователю, что медиаконтент можно отправлять только раз в 2 часа", true)
	.setFooter("Продолжение следует...", "")

	message.channel.send({embed});
}


module.exports.help = {
	name: "bothelp"
}
