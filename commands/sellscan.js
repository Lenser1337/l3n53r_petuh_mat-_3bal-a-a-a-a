const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);

module.exports.run = async (bot, message, args) => {

  let warnchannel = message.guild.channels.find(`name`, "🌘reports_bots");
  let errorschannel = message.guild.channels.find(`name`, "🌏errors_bots");

  let sicon = message.guild.iconURL;
  var wut = bot.emojis.find("name", "wut");

  const sellMessage = args.join(" ");

  const embed = new Discord.RichEmbed()
  .setTitle(`Возможный абуз ${wut}`)
  .setColor("#ff0000")
  .addField("Возможный нарушитель", message.member, true)
  .addField("Канал", message.channel, true)
  .addField("Полный текст", sellMessage, true);

  if(warnchannel){
    warnchannel.send({embed});
  } else {
    console.log("No warnchannel defined");
  }
}

module.exports.help = {
  name: "sellscan"
}
