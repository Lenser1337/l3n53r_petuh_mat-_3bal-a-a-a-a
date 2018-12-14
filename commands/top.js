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

  // if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "🚨РетроТестер🚨"].includes(r.name)))
  //   return;

  var topusers = User.find().sort({retrocoinTotal: -1}).limit(50).lean().exec(function(err, doc) {
    if(err)
      console.log(err);
    else{
      if(!args[0] || args[0] == '1'){
        var x = 0;
        var maxX = 9;
      }
      else if(args[0] == '2'){
        var x = 10;
        var maxX = 19;
      }
      else if(args[0] == '3'){
        var x = 20;
        var maxX = 29;
      }
      else if(args[0] == '4'){
        var x = 30;
        var maxX = 39;
      }
      else if(args[0] == '5'){
        var x = 40;
        var maxX = 49;
      }
      else {
        return message.reply("можно просмотреть только 50 самых богатых пользователей сервера, укажи страницу с 1 по 5!")
      }

      var y = 0;
      var text = ``;

      while(x < maxX)
        text += `**${y=x+1}.** ${doc[x].displayName} • **${numberWithCommas(doc[x++].retrocoinTotal)} ретрика(ов)**\n`;

      message.channel.send({embed: {
        color: 3447003,
        title: `**Retro Valley** :zap: **LEADERBOARD**`,
        fields: [
          {
            name: "(кошелек просто по швам идет)",
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
  name: "top"
}
