const Discord = require("discord.js");

//voiceunmute @member Time

module.exports.run = async (bot, message, args) => {

  let tovunmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  let repchannel = message.guild.channels.find(`name`, "🌘reports_bots");
  let errorschannel = message.guild.channels.find(`name`, "🌏errors_bots");

  //лимит который нужно прописать во все комманды что бы никто другой пока что не использовал
  if(!message.member.hasPermission("MANAGE_MESSAGES"))
    return;
  if(!message.member.hasPermission("MOVE_MEMBERS", "ADMINISTRATOR"))
    return message.channel.send("Похоже у тебя недостаточно на это прав, дружище :thinking:. ");
  if(!tovunmute)
    return message.reply("пользователь не существует!");
  if(!errorschannel)
    return message.channel.send("Канал ошибок не существует!");
  if(!repchannel)
    errorschannel.send("Канал репортов не существует!");
  if(!repchannel)
    return message.channel.send("Канал репортов не существует!");

  await(tovunmute.setMute(false));


  const embed = new Discord.RichEmbed()
  .setTitle(`:star: Отчет о размуте админом :star:`)
  .addField("Размученый:", `<@${tovunmute.id}>`, true)
  .addField("Размутил:", `${message.member}`, true)
  .setColor("#1BA364")

  repchannel.send({embed});

  message.channel.send(`Есть, капитан! <@${tovunmute.id}> снова может говорить! :ok_hand: `);

}

module.exports.help = {
  name: "voiceunmute"
}
