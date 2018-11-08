
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  let mainchannel = message.guild.channels.find(`name`, "💬общение");
  const sayMessage = args.join(" ");
  message.delete().catch(O_o=>{});

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Стример", "Тех. Стажер"].includes(r.name)))
    return;

  message.delete().catch();
  mainchannel.send(sayMessage);
}

module.exports.help = {
  name: "say"
}
