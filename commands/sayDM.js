const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  var dmchannel = bot.channels.find(`id`, "531815935544131594");
  let user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  let sayMessage = "";
  sayMessage = args.join(" ").slice(22);
  message.delete().catch(O_o=>{});

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Стример", "Тех. Стажер"].includes(r.name)))
    return;

    dmchannel.send({embed: {
      color: 3447003,
      title: `Отправлено...`,
      fields: [
      {
        name: `Сообщение`,
        value: sayMessage
      }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: user.avatarURL,
        text: `${user.username}`
      }
    }
  });
  message.delete().catch();
  user.send(sayMessage);
}

module.exports.help = {
  name: "sayDM"
}
