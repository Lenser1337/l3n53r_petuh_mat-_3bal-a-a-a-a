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

  var n = message.content.search(",");
  var hmmIcon = bot.emojis.find("name", "hmm");
  var hohomenIcon = bot.emojis.find("name", "hohomen");
  var simpleIcon = bot.emojis.find("name", "this_is_simple");

  if (n != -1)
    return message.channel.send("Запятые в статус ставить нельзя!");

  if (!args[0])
    return message.reply("укажите статус!");

  var status = message.content.split(" ").toString();
  var to_cut = status.indexOf(",");
  status = status.slice(to_cut + 1);
  status = status.replace(/,/g, " ");
  status = status.replace(/\s\s+/g, ' ');

  if (status.length >= 35)
    return message.reply(`слишком длинный статус, сорян ${hmmIcon}`)

  var user_obj = User.findOne({
    userID: message.member.id
  }, function (err, foundObj) {
    if (err)
      console.log("Error on database findOne: " + err);
    else {
      if (!foundObj)
        console.log("Something stange happend");
      else {

        if (foundObj.lastChangeStatus){

          var dateTime = Date.now();
          var timestamp = Math.floor(dateTime/1000);
          var timestampLimit = Math.floor(foundObj.lastChangeStatus/1000) + 900;

          if (timestampLimit > timestamp)
            return message.reply(`ты недавно уже менял статус ${simpleIcon}`);
        }

        foundObj.status = status;
        foundObj.lastChangeStatus = Date.now();
        foundObj.save(function(err, updatedObj){
          if(err)
            console.log(err);
        });
        return message.reply(`статус обновлен ${hohomenIcon}`);
      }
    }
  });
}

module.exports.help = {
  name: "changestatus"
}
