const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot) => {

  var server = bot.guilds.find("id", "269072926748311554");

  if (!server)
    return console.log("No found guild");

  var rainbowrole = server.roles.find("id", "541714178595880992");

  if(!rainbowrole)
    return console.log("No found role");
  else{
    var interval = setInterval(function(){
      var min = 1;
      var max = 16777215;
      var randomcolor = Math.floor(Math.random() * (max - min + 1)) + min;
      rainbowrole.setColor(randomcolor);
    }, 1000);
  }
}


module.exports.help = {
  name: "rainbowrole"
}
