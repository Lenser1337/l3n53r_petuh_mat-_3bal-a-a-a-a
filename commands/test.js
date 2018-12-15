const Discord = require("discord.js");
var Jimp = require('jimp');

module.exports.run = async (bot, message, args) => {
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Тех. Стажер"].includes(r.name)))
    return;
  console.log('Process.env is: ' + JSON.stringify(process.env));

  const embed = new Discord.RichEmbed()
  .setColor("#FF0000")
  .setImage("/images/body.png")
  message.channel.send({embed});

  // var images = [process.env.PWD="/images/body.png", process.env.PWD="/images/eyes.png", process.env.PWD="/images/mouth.png"];
  // var jimps = [];
  //
  // for (var i = 0; i < images.length; i++){
  //   jimps.push(Jimp.read(images[i]));
  // }
  //
  // Promise.all(jimps).then(function(data) {
  //   return Promise.all(jimps);
  // }).then(function(data) {
  //   data[0].composite(data[1],0,0);
  //   data[0].composite(data[2],0,0);
  //
  //   data[0].write('final.png', function(){
  //     console.log('done!');
  //   });
  // });

}

module.exports.help = {
  name: "test"
}
