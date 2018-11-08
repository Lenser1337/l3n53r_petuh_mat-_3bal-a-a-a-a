const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {

  var retricIcon = bot.emojis.find("name", "retric");

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "🚨РетроТестер🚨"].includes(r.name)))
    return;

  var topusers = User.find().sort({infractions: -1}).limit(10).lean().exec(function(err, doc) {
    if(err)
      console.log(err);
    else{
      var maxX = doc.length;
      var x = 0;
      var y = 0;
      var text = ``;
      while(x < maxX)
        text += `**${y=x+1}.** ${doc[x].displayName} • **${numberWithCommas(doc[x++].infractions)} варнов(а)**\n`;

      message.channel.send({embed: {
        color: 3447003,
        title: `**Retro Valley** :zap: **WARNS LEADERBOARD**`,
        fields: [
        {
          name: "(наши бундари)",
          value: text
        }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: message.author.avatarURL,
          text: `© ${message.member.displayName}`
        },
      }
    });
    }
  });
}

module.exports.help = {
  name: "infractions"
}
