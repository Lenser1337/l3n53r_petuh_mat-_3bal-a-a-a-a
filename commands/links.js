const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

//	message.delete().catch(O_o=>{});

	let bicon = bot.user.avatarURL;
	const embed = new Discord.RichEmbed()
	.setTitle(":fire: Интересные ссылки :fire:")
	.setColor("#FF7700")
	.setThumbnail(bicon)
	.addField("Канал Салливана", "https://www.youtube.com/channel/UCnK6AKESj7cxltJkAsEMsXA", true)
	.addField("Группа в ВК", "https://vk.com/sallyshow", true)
	.addField("Банда в Steam", "https://steamcommunity.com/groups/sallywan_club", true)
	.addField("Twitch", "https://www.twitch.tv/sallywan_rus", true)
	.setImage(`https://cdn.discordapp.com/attachments/468827549582229504/574952276628865044/Q_JkCodO8q6_W7PJYOusi5IDFD_ducy_xUjaQAGE39zuLYCUXHgaxPcLkPW6AzzaHvOFh7pqgQw2560-fcrop64100005a57ffff.png`)

	message.channel.send({embed});
}


module.exports.help = {
	name: "links"
}
