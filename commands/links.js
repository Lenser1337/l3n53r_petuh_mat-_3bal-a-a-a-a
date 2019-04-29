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
	.setImage(`https://cdn.discordapp.com/attachments/572413948369043466/572413982355488768/channels4_banner.jpg`)

	message.channel.send({embed});
}


module.exports.help = {
	name: "links"
}
