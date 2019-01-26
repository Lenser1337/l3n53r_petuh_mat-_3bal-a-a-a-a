const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var Item = require('./../schemas/gangshop_model.js');

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {

  // var retricIcon = bot.emojis.find("name", "retric");

  // if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "🚨РетроТестер🚨"].includes(r.name)))
  //   return;

  var shop_channel = message.guild.channels.find(`name`, "💸основное_экономика");

  if (!args[0] || args[0] == '1'){
    var items = Item.find().sort({itemPrice: 1}).limit(15).lean().exec(function(err, doc) {
      if(err)
        console.log(err);
      else{
        var maxX = doc.length;
        var x = 0;
        var y = 0;
        var text = ``;
        while (x < maxX){
          text += `**${y=x+1}.** ${doc[x].itemName} • **${numberWithCommas(doc[x++].itemPrice)} ретриков**\n`;
        }

        message.channel.send({embed: {
          color: 3447003,
          title: `**Retro Valley** :shopping_cart: **Магазин Группировок**`,
          fields: [
          {
            name: "(налетай-покупай)",
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
  else if (args[0] == '2'){
    var items = Item.find().sort({itemPrice: 1}).limit(30).lean().exec(function(err, doc) {
      if(err)
        console.log(err);
      else{
        var maxX = doc.length;
        var x = 15;
        var y = 0;
        var text = ``;
        while (x < maxX){
          text += `**${y=x+1}.** ${doc[x].itemName} • **${numberWithCommas(doc[x++].itemPrice)} ретриков**\n`;
        }

        message.channel.send({embed: {
          color: 3447003,
          title: `**Retro Valley** :shopping_cart: **Магазин**`,
          fields: [
          {
            name: "(налетай-покупай)",
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
  else if (args[0] == '3'){
    var items = Item.find().sort({itemPrice: 1}).limit(45).lean().exec(function(err, doc) {
      if(err)
        console.log(err);
      else{
        if (!items)
          return message.reply("похоже третьей страницы пока-что нету :thinking:");
        var maxX = doc.length;
        var x = 30;
        var y = 0;
        var text = ``;
        while (x < maxX){
          text += `**${y=x+1}.** ${doc[x].itemName} • **${numberWithCommas(doc[x++].itemPrice)} ретриков**\n`;
        }

        message.channel.send({embed: {
          color: 3447003,
          title: `**Retro Valley** :shopping_cart: **Магазин**`,
          fields: [
          {
            name: "(налетай-покупай)",
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
  else
    return message.reply("похоже запрошеной страницы еще не существует :thinking:");
}

module.exports.help = {
  name: "gangshop"
}
