const Discord = require("discord.js");

//ban @member reason

module.exports.run = async (bot, message, args) => {

	const bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
	let repchannel = message.guild.channels.find(`name`, "🌘reports_bots");
	let errorschannel = message.guild.channels.find(`name`, "🌏errors_bots");
	let bReason = args.join(" ").slice(22);

  message.delete().catch(O_o=>{});

	if(!bUser)
		return message.channel.send("Пользователь не существует!").then(msg => msg.delete(10000));
	if(!message.member.hasPermission("BAN_MEMBERS", "ADMINISTRATOR"))
		return message.channel.send("Похоже у тебя недостаточно на это прав, дружище :thinking:.").then(msg => msg.delete(10000));
	if(bUser == message.member)
		return message.channel.send("Самого себя забанить не выйдет...").then(msg => msg.delete(10000));
	if(bUser.hasPermission("MANAGE_MESSAGES"))
		return message.channel.send("Этот пользователь не может быть забанен!").then(msg => msg.delete(10000));
	if(!errorschannel)
		return message.channel.send("Канал ошибок не существует!").then(msg => msg.delete(10000));
	if(!repchannel)
		errorschannel.send("Канал репортов не существует!").then(msg => msg.delete(10000));
	if(!repchannel)
		return message.channel.send("Канал репортов не существует!").then(msg => msg.delete(10000));

	let embed = new Discord.RichEmbed()
	.setTitle("ОТЧЕТ О БАНЕ")
	.setColor("#DD5044")
	.addField("Забаненный пользователь:", `${bUser}`, true)
	.addField("Пользователя забанил:", `<@${message.author.id}>`, true)
	.addField("Забанен в канале:", message.channel, true)
	.addField("Время бана:", message.createdAt, true)
	.addField("Был забанен за:", bReason, true)

	message.guild.member(bUser).ban(bReason);

	message.delete(3000);
		message.channel.send(bUser+" был забанен за "+ bReason).then(msg => msg.delete(10000));
	repchannel.send({embed});
}

module.exports.help = {
	name: "ban"
}
