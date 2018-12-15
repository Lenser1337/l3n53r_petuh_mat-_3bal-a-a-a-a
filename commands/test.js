const Discord = require("discord.js");
var Jimp = require('jimp');

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Тех. Стажер"].includes(r.name)))
    return;

  Jimp.read('http://www.travelandstyle.ca/wp-content/uploads/2015/07/Hotel-Valley-Ho-Vintage-Pool.jpg')
  .then(image => {
    message.channel.send("1");
    message.channel.send(image);
    image.resize(256, 256);
    message.channel.send("2");
    return message.channel.send(image);
  })
  .catch(err => {
    console.log(err);
  });

}

module.exports.help = {
  name: "test"
}
