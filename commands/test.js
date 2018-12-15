const Discord = require("discord.js");
var Jimp = require('jimp');

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Тех. Стажер"].includes(r.name)))
    return;

  Jimp.read('http://www.travelandstyle.ca/wp-content/uploads/2015/07/Hotel-Valley-Ho-Vintage-Pool.jpg')
  .then(image => {
    message.channel.send("1");
    image.resize(256, 256)
//    .write("https://retrobotproject.herokuapp.com/images/test-small.jpg");
    .write("test-small.jpg");
  })
  .catch(err => {
    console.log(err);
  });

}

module.exports.help = {
  name: "test"
}
