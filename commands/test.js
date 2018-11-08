const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Стример", "Тех. Стажер"].includes(r.name)))
    return;

  message.channel.send('Занятся сексом? 10 сек')
  .then(() => {
    message.channel.awaitMessages(response => response.content === 'да', {
      max: 1,
      time: 10000,
      errors: ['time'],
    })
    .then((collected) => {
      message.channel.send(`${collected.first().content}! Чпок чпок!`);
    })
    .catch(() => {
      message.channel.send('Видимо, это отказ');
    });
  });

}

module.exports.help = {
  name: "test"
}
