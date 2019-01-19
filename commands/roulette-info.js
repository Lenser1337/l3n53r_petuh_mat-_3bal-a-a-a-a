const Discord = require("discord.js");

//help

module.exports.run = async (bot, message, args) => {

	//лимит который нужно прописать во все комманды что бы никто другой пока что не использовал
	// if(!message.member.hasPermission("MANAGE_MESSAGES"))
	// 	return;

	message.delete().catch(O_o=>{});

	const embed = new Discord.RichEmbed()
	.setTitle("Информация о рулетке")
	.setColor("#BF44FF")
	.addField("Как использовать: roulette <Ставка> <На что>", "--------------------", true)
	.addField("На что можно поставить:", "--------------------", true)
	.setImage("https://retrobotproject.herokuapp.com/images/roulette.jpg")

	message.channel.send({embed});
}


module.exports.help = {
	name: "roulette-info"
}
