const Discord = require("discord.js");
const fs = require("fs");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var Item = require('./../schemas/gangshop_model.js');

module.exports.run = async (bot, message, args) => {

  message.delete(3000);

  if(!message.member.roles.some(r=>["Тех. Администратор"].includes(r.name)))
    return;

  //message.delete().catch(O_o=>{});

  if(!args[2])
    return message.reply(`название / цена / уровень`).then(msg => msg.delete(10000));

  var itm = "";
  var prc = 1;
  var level = 1;
  if(message.cleanContent.indexOf('"') > -1){
    itm = message.cleanContent.split('"', 2).pop();
    console.log("item: " + itm);
    var newStr = message.cleanContent.split('"').pop();
    prc = newStr.split(" ", 2).pop();
    level = newStr.split(" ", 2).pop();
    console.log("price: " + prc);
    console.log("level: " + level);
  }
  else {
    itm = args[0];
    prc = Number(args[1]);
    level = Number(args[2]);
    if (prc == NaN || level == NaN)
      return message.reply("цена и уровень могут быть только цифрами");
    console.log("itm: " + itm + ", prc: " + prc + ", level: " + level);
  }
  // var newItem = new Item({
  //   itemName: itm,
  //   itemPrice: prc,
  //   requiredLevel: level,
  //   created: Date.now()
  // });
  // newItem.save()
  // .then(item => {
  //   console.log('New item "'+itm+'" added to database');
  // })
  // .catch(err => {
  //   console.log("Error on database save: " + err);
  // });
  // return message.reply(`"${itm}" добавлено в магазин группировок`).then(msg => msg.delete(10000));

}

module.exports.help = {
  name: "gangadditem"
}
