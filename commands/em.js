
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  const sayMessage = args.join(" ");
  message.delete().catch(O_o=>{});

  if(!message.member.roles.some(r=>["Тех. Администратор"].includes(r.name)))
    return;

  message.delete().catch();
  message.channel.send({embed: {
  color: 9359868
}});
}

module.exports.help = {
  name: "em"
}
