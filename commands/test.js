const Discord = require("discord.js");
var Jimp = require('jimp');

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Тех. Стажер"].includes(r.name)))
    return;
  console.log('Process.env.PWD is: ' + process.env.PWD);

  // var images = [];
  // var jimps = [];
  //
  // for (var i = 0; i < images.length; i++){
  //   jimps.push(Jimp.read(images[i]));
  // }


}

module.exports.help = {
  name: "test"
}
