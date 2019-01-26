const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');
var Item = require('./../schemas/shop_model.js');
var Gang = require('./../schemas/gang_model.js');


module.exports.run = async (bot, message, args) => {

	var shop_channel = message.guild.channels.find(`name`, "💸основное_экономика");

	if (message.channel.name != "💸основное_экономика" && message.channel.name != "🌎general_bots" && message.channel.name != "🕵секретный_чат" && message.channel.name != "🍲комната_отдыха"){
		message.delete(3000);
		return message.reply(`использовать вещи можно только в ${shop_channel}`).then(msg => msg.delete(10000));
	}

	//message.delete().catch(O_o=>{});

	//ищем есть ли человек, который пытается что либо купить, у нас в базе
	var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});

	if (typeof user_obj === 'undefined' || user_obj === null)
		return message.reply("пользователь не найден в базе");

	//парсим что человек пытается юзануть
	var item = message.content.split(" ").toString();
	var to_cut = item.indexOf(",");
	item = item.slice(to_cut + 1);
	item = item.replace(/,/g, " ");
	item = item.replace(/\s\s+/g, ' ');

	//Поиск данной вещи в магазине (для того что бы знать юзабелен ли этот итем)
	var item_obj = await Item.findOne({itemName: {$regex: item, $options: 'i'}}, function(err, found_item){});

	if (typeof item_obj === 'undefined' || item_obj === null)
		return message.reply("этой вещи больше нету в магазине");

	//ищем есть ли у человека этот итем

	if (user_obj.inv.includes(item_obj.itemName) == false)
		return message.reply(`у тебя нету ${item_obj.itemName}`);
		
    var index = user.inv.indexOf(item.itemName);
		var newinv = user_obj.inv;
		newinv.splice(index, 1);
    user_obj.inv = newinv;
		var price = item_obj.itemPrice / 2;
    user_obj.retrocoinBank = user_obj.retrocoinBank + price;
    user_obj.save(function(err, updatedObj){
      if (err)
        console.log(err);
    });
    message.reply(`ты удачно продал ${item_obj.itemName} и получил ${price}`)
}

module.exports.help = {
	name: "sell"
}
