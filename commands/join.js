const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор",].includes(r.name)))
    return;
  message.delete().catch(O_o=>{});

  if (message.member.voiceChannel) {
    message.member.voiceChannel.join()
    .then(connection => {
      message.reply('я вместе с вами!');
    })
    .catch(console.log);
  } else {
    message.reply('зайди в войс сперва!');
  }
}

module.exports.help = {
	name: "join"
}
