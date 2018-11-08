const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name)))
    return;
  message.delete().catch(O_o=>{});

  bot.voiceChannel.leave();
  message.reply('до встречи!');
}

module.exports.help = {
	name: "leave"
}
