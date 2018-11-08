const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

	if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name)))
    	return;

    message.delete().catch(O_o=>{});

    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

  	if(!user){
		const embed = new Discord.RichEmbed()
		.setColor("#FF0000")
		.setImage("https://retrobotproject.herokuapp.com/images/selffive.gif")
		message.channel.send({embed});
   	}
   	else {
		const embed = new Discord.RichEmbed()
		.addField("Эй", `${user}`, true)
		.setColor("#FF0000")
		.setImage("https://retrobotproject.herokuapp.com/images/selffive.gif")
		message.channel.send({embed});
	}
}

module.exports.help = {
	name: "molodec"
}
