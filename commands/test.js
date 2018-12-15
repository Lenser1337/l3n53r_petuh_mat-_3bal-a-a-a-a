const Discord = require("discord.js");
var Jimp = require('jimp');

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Тех. Стажер"].includes(r.name)))
    return;

  var images = [
    "https://retrobotproject.herokuapp.com/images/body.png",
    "https://retrobotproject.herokuapp.com/images/eyes.png",
    "https://retrobotproject.herokuapp.com/images/mouth.png"
  ];

  var jimps = [];

  for (var i = 0; i < images.length; i++){
    jimps.push(Jimp.read(images[i]));
  }

  Promise.all(jimps).then(function(data) {
    return Promise.all(jimps);
  }).then(function(data) {
    console.log("body img: " + JSON.stringify(data[0]));
    data[0].composite(data[1],0,0);
    data[0].composite(data[2],0,0);
    data[0].getBase64(Jimp.MIME_PNG, function(res){
      console.log("res is: " + JSON.stringify(res));
      // const embed = new Discord.RichEmbed()
      // .setColor("#FF0000")
      // .setImage("https://retrobotproject.herokuapp.com/images/body.png")
      // message.channel.send({embed});
    });
  });

}

module.exports.help = {
  name: "test"
}
