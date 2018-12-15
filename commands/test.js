const Discord = require("discord.js");
var Jimp = require('jimp');

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Тех. Стажер"].includes(r.name)))
    return;

  var images = [
    "images/body.png",
    "images/eyes.png",
    "images/mouth.png"
  ];

  var jimps = [];

  for (var i = 0; i < images.length; i++){
    jimps.push(Jimp.read(images[i]));
  }

  Promise.all(jimps).then(function(data) {
    return Promise.all(jimps);
  }).then(function(data) {
    data[0].composite(data[1],0,0);
    data[0].composite(data[2],0,0);

    data[0].write("images/face.png", function(res){
      const embed = new Discord.RichEmbed()
      .setColor("#FF0000")
      .setImage("images/face.png")
      message.channel.send({embed});
    });
  });

}

module.exports.help = {
  name: "test"
}
