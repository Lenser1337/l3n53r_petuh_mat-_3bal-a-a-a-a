const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор",].includes(r.name)))
    return;
  message.delete().catch(O_o=>{});

  if (message.member.voiceChannel) {
    message.channel.send("voiceChannel name: " + message.member.voiceChannel.name);
  } else {
    message.reply('ты не в войсе!');
  }
}

module.exports.help = {
	name: "find2"
}
