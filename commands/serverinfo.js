const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

	//лимит который нужно прописать во все комманды что бы никто другой пока что не использовал
	// if(!message.member.hasPermission("MANAGE_MESSAGES"))
	// 	return;

	message.delete().catch(O_o=>{});

	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var creationDate = message.guild.createdAt;
	var todayDate = new Date();

	var diffDays = Math.round(Math.abs((creationDate.getTime() - todayDate.getTime())/(oneDay)));

	function formatDate(date) {
  var monthNames = [
    "января", "февраля", "марта",
    "апреля", "мая", "июня", "июля",
    "августа", "сентября", "октября",
    "ноября", "декабря"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var time = hour + ":" + minute + ":" + second;

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ', ' + time;
}


	var sicon = message.guild.iconURL;
	const embed = new Discord.RichEmbed()
	.setTitle("ИНФОРМАЦИЯ О СЕРВЕРЕ")
	.setColor("#4C8BF5")
	.setThumbnail(sicon)
	.addField("Имя сервера:", message.guild.name, true)
	.addField("Версия сервера:", "2.0", true)
	.addField("Сервер создан:", formatDate(message.guild.createdAt), true)
	.addField("Дней серверу:", diffDays, true)
	.addField("Вы присоединились:", formatDate(message.member.joinedAt), true)
	.addField("Всего учасников:", message.guild.memberCount, true)

	message.channel.send({embed});
}

module.exports.help = {
	name: "serverinfo"
}
