const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  let mymessage = args.join(" ").slice(22);
  let pnchannel = message.guild.channels.find(`name`, "👋поиск_напарников");

    let bicon = bot.user.avatarURL;
    const embed = new Discord.RichEmbed()
    .setTitle("ИЩУ НАПАРНИКА")
    .setDescription(mymessage)
    .setColor("#4C8BF5")
    .setThumbnail(bicon)


    pnchannel.send({embed});
}

module.exports.help = {
    name: "find"
}
