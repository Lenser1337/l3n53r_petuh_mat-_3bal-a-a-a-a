const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

function sinToHex(size, i, phase) {

  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? "0"+hex : hex;
}

module.exports.run = async (bot) => {
var guild = bot.guilds.find(x => x.id === "269072926748311554");

if (!guild){
    return console.log("No guild found");
}

var targetRole = guild.roles.find(role => role.id === "445893894668812290");

if(!targetRole){
    return console.log("No role found");
}
else{
    var size = 96;
    var colorPalette = new Array(size);
    for (var i=0; i<size; i++) {
        var red = sinToHex(size, i, 0 * Math.PI * 2/3);
        var blue = sinToHex(size, i, 1 * Math.PI * 2/3);
        var green = sinToHex(size, i, 2 * Math.PI * 2/3);
        colorPalette[i] = "#"+ red + green + blue;
    }
    var x = 0;
    var myVar = setInterval(function(){
        targetRole.setColor(colorPalette[x]).then(function(){
            if (x < size)
                x = x + 1;
            else
                x = 0;
        }, error => {
            console.log(error);
        }).catch(console.error);
    }, 1000);
}
}
module.exports.help = {
  name: "rainbowcolor"
}
