const Discord = require("discord.js");
var Jimp = require('jimp');

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Тех. Стажер"].includes(r.name)))
    return;

  Jimp.read('http://www.travelandstyle.ca/wp-content/uploads/2015/07/Hotel-Valley-Ho-Vintage-Pool.jpg')
  .then(image => {
    message.channel.send("1");
    console.log("Image: " + image);
    console.log("JSON IS: " + JSON.stringify(image));
  })
  .catch(err => {
    console.log(err);
  });

}

module.exports.help = {
  name: "test"
}
