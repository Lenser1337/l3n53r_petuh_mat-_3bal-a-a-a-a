const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var Item = require('./../schemas/gangshop_model.js');
var User = require('./../schemas/user_model.js');
var Gang = require('./../schemas/gang_model.js');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

function getMoneyFromGang(gang, item){
  var gang_obj = Gang.findOne({name: gang.name}, function(err, found_gang){
    if (err)
      console.log("WTF there is an error: " + err);
    else {
      if (!gang_obj)
        console.log("User not found");
      else {
        var newBalance = found_gang.balance - item.itemPrice;
        found_gang.balance = newBalance;
        found_gang.save(function(err, updatedObj){});
      }
    }
  });
}

function levelUpTheGang(gang){
  var gang_obj = Gang.findOne({name: gang.name}, function(err, found_gang){
    if (err)
      console.log("WTF there is an error: " + err);
    else {
      if (!gang_obj)
        console.log("User not found");
      else {
        var newLevel = found_gang.level + 1;
        found_gang.level = newLevel;
        found_gang.save(function(err, updatedObj){});
      }
    }
  });
}

function gangBuyItem(bot, message, user, gang, item){
  //do the magic stuff first
  if (item.itemName == "Повышение уровня: 2"){
    if (gang.level >= 2)
      return message.reply("ты что, ваша группировка уже достигла 2го уровня!");
    else {
      levelUpTheGang(gang);
      getMoneyFromGang(gang, item);
      message.reply("уровень группировки успешно повышен! Теперь вас может быть больше! Приглашай новеньких! В магазине скорее-всего тоже что-то новое появилось!");
    }
  }
  else if (item.itemName == "Повышение уровня: 3"){
    if (gang.level >= 3)
      return message.reply("ты что, ваша группировка уже достигла 3го уровня!");
    else {
      levelUpTheGang(gang);
      getMoneyFromGang(gang, item);
      message.reply("уровень группировки успешно повышен! Теперь вас может быть больше! Приглашай новеньких! В магазине скорее-всего тоже что-то новое появилось!");
    }
  }
  else if (item.itemName == "Повышение уровня: 4"){
    if (gang.level >= 4)
      return message.reply("ты что, ваша группировка уже достигла 4го уровня!");
    else {
      levelUpTheGang(gang);
      getMoneyFromGang(gang, item);
      message.reply("уровень группировки успешно повышен! Теперь вас может быть больше! Приглашай новеньких! В магазине скорее-всего тоже что-то новое появилось!");
    }
  }
  else if (item.itemName == "Повышение уровня: 5"){
    if (gang.level >= 5)
      return message.reply("ты что, ваша группировка уже достигла 5го уровня!");
    else {
      levelUpTheGang(gang);
      getMoneyFromGang(gang, item);
      message.reply("уровень группировки успешно повышен! Теперь вас может быть больше! Приглашай новеньких! В магазине скорее-всего тоже что-то новое появилось!");
    }
  }
  //to be continued...
}

module.exports.run = async (bot, message, args) => {

	var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});

	if (typeof user_obj === 'undefined' || user_obj === null)
		return message.reply("пользователь не найден в базе");

  if (typeof user_obj.leaderOf === 'undefined' || user_obj.leaderOf === null)
    return message.reply("ты не являешься лидером какой-либо группировки!");

  var gang_obj = await Gang.findOne({name: user_obj.leaderOf}, function(err, found_gang){});

	var item = message.content.split(" ").toString();
	var to_cut = item.indexOf(",");
	item = item.slice(to_cut + 1);
	item = item.replace(/,/g, " ");
	item = item.replace(/\s\s+/g, ' ');

	var item_obj = await Item.findOne({itemName: {$regex: item, $options: 'i'}}, function(err, found_item){});

	if (typeof item_obj === 'undefined' || item_obj === null)
		return message.reply("укажите название из магазина!");

  if (gang_obj.balance - item_obj.itemPrice < 0)
    return message.reply("на счету вашей группировки не достаточно ретриков для этой покупки!");

  gangBuyItem(bot, message, user_obj, gang_obj, item_obj);
}
module.exports.help = {
	name: "gangbuy"
}
