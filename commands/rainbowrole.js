const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot) => {

  var guild = bot.guilds.find("id", "269072926748311554");
  console.log(guild.owner)
  if (!guild)
    return console.log("No guild found");

  var rainbowrole = guild.roles.find("id", "541696532618018853");

  if(!rainbowrole)
    return console.log("No role found");
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
