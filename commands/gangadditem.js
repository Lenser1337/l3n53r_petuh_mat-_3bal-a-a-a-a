const Discord = require("discord.js");
const fs = require("fs");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var Item = require('./../schemas/gangshop_model.js');

module.exports.run = async (bot, message, args) => {

  message.delete(3000);
  //лимит который нужно прописать во все комманды что бы никто другой пока что не использовал
  // if(!message.member.hasPermission("MANAGE_ROLES"))
  //   return;
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name)))
    return;

  message.delete().catch(O_o=>{});

  if(!args)
    return message.reply(`"название" цена`).then(msg => msg.delete(10000));
  var itm = "";
  var prc = 0;
  if(message.cleanContent.indexOf('"') > -1){
    itm = message.cleanContent.split('"', 2).pop();
    var newStr = message.cleanContent.split('"').pop();
    prc = newStr.split(" ", 2).pop();
  }
  else {
    prc = Number(args[1]);
    itm = args[0];
  }
  var newItem = new Item({
    itemName: itm,
    itemPrice: prc,
    created: Date.now()
  });
  newItem.save()
  .then(item => {
    console.log('New item "'+itm+'" added to database');
  })
  .catch(err => {
    console.log("Error on database save: " + err);
  });
  return message.reply(`"${itm}" добавлено в магазин группировок`).then(msg => msg.delete(10000));

}

module.exports.help = {
  name: "gangadditem"
}
