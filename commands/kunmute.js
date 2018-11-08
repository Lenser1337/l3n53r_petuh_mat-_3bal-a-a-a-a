const Discord = require("discord.js");

//unmute @member

module.exports.run = async (bot, message, args) => {

  let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  let muterole = message.guild.roles.find(`name`, "Пинок под жопу (Мут канализации)");
  let repchannel = message.guild.channels.find(`name`, "🌘reports_bots");
  let errorschannel = message.guild.channels.find(`name`, "🌏errors_bots");

  if(!message.member.hasPermission("MOVE_MEMBERS", "ADMINISTRATOR"))
    return message.channel.send("Похоже у тебя недостаточно на это прав, дружище :thinking:. ");
  if(!tounmute)
    return message.reply("Пользователь не существует!");
  if(!muterole)
    return errorschannel.send("Роль мута не найдена!");
  if(!errorschannel)
    return message.channel.send("Канал ошибок не существует!");
  if(!repchannel)
    errorschannel.send("Канал репортов не существует!");
  if(!repchannel)
    return message.channel.send("Канал репортов не существует!");
  repchannel.send(`<@${tounmute.id}> был размучен администратором <@${message.member.id}> в канализации!`);
  await(tounmute.removeRole(muterole.id));
  message.channel.send(`Есть, капитан! <@${tounmute.id}> теперь свободен, как птичка в небе! :ok_hand: `);
}

module.exports.help = {
  name: "kunmute"
}
