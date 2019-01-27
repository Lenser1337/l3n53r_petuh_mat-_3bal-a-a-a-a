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

  var topusers = User.find().sort({retrocoinTotal: -1}).limit(60).lean().exec(function(err, doc) {
    if(err)
      console.log(err);
    else{
      doc.forEach(function(user){
        if (user.userID == '215970433088880641'){//я
          console.log("ignore 1");
          var index = doc.indexOf(user);
          if (index > -1)
            doc.splice(index, 1);
        }
        else if (user.userID == '354261484395560961'){//Семен
          console.log("ignore 2");
          var index = doc.indexOf(user);
          if (index > -1)
            doc.splice(index, 1);
        }
      });
      if(!args[0] || args[0] == '1'){
        var x = 0;
        var maxX = 10;
      }
      else if(args[0] == '2'){
        var x = 10;
        var maxX = 20;
      }
      else if(args[0] == '3'){
        var x = 20;
        var maxX = 30;
      }
      else if(args[0] == '4'){
        var x = 30;
        var maxX = 40;
      }
      else if(args[0] == '5'){
        var x = 40;
        var maxX = 50;
      }
      else {
        return message.reply("можно просмотреть только 50 самых богатых пользователей сервера, укажи страницу с 1 по 5!")
      }

      var y = 0;
      var text = ``;

      while(x < maxX)
        text += `**${y=x+1}.** ${doc[x].displayName} • **${numberWithCommas(doc[x++].retrocoinTotal)} ретрика(ов)**\n`;

      message.channel.send({embed: {
        color: message.member.highestRole.color,
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
