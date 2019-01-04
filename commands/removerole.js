//!removerole @member role

const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  message.delete(3000);


  let repchannel = message.guild.channels.find(`name`, "🌘reports_bots");
  let errorschannel = message.guild.channels.find(`name`, "🌏errors_bots");
  let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  let role = args.join(" ").slice(22);

  if((!message.member.hasPermission("MANAGE_ROLES")) || (!message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name))))
    return message.reply("похоже у тебя недостаточно на это прав, дружище :thinking:.").then(msg => msg.delete(10000));
  if(!rMember)
    return message.reply("пользователь не существует!").then(msg => msg.delete(10000));
  if(!role)
    return message.reply("укажите роль!").then(msg => msg.delete(10000));
  let gRole = message.guild.roles.find(`name`, role);
  if(!gRole)
    return message.reply("указанная вами роль не существует!").then(msg => msg.delete(10000));
  if(!errorschannel)
    return message.channel.send("Канал ошибок не существует!").then(msg => msg.delete(10000));
  if(!repchannel)
    return errorschannel.send("Канал репортов не существует!").then(msg => msg.delete(10000));
  if(!repchannel)
    return message.channel.send("Канал репортов не существует!").then(msg => msg.delete(10000));
  if(!rMember.roles.has(gRole.id))
    return message.channel.send(`У <@${rMember.id}> нет роли ${gRole.name}!`).then(msg => msg.delete(10000));
  await(rMember.removeRole(gRole.id));

  message.channel.send(`<@${rMember.id}> потерял роль ${gRole.name}! :ok_hand:`).then(msg => msg.delete(10000));
  repchannel.send(`<@${rMember.id}> потерял роль ${gRole.name}! :ok_hand:`);
}

module.exports.help = {
  name: "removerole"
}
