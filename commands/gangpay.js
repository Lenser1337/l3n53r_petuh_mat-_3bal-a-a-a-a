const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');
var Gang = require('./../schemas/gang_model.js');

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(date) {
  var monthNames = [
  "января", "февраля", "марта",
  "апреля", "мая", "июня", "июля",
  "августа", "сентября", "октября",
  "ноября", "декабря"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var time = hour + ":" + minute + ":" + second;

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ', ' + time;
}

module.exports.run = async (bot, message, args) => {
 var user_obj = await User.findOne({userID: message.member.id}, function (err, foundObj){});
 if (user_obj.gang == null || typeof user_obj.gang == 'undefined')
   return message.reply("ты не находишься в группировке!");
 var gangName = user_obj.gang;
 var cash = user_obj.retrocoinCoin;
 var retricIcon = bot.emojis.find("name", "retric");

 	if (args[0] === "all"){
    var user_obj = await User.findOne({
			userID: message.member.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj)
					console.log("Something stange happend");
				else {
					if (foundObj.retrocoinCash === 0)
						return message.reply("чеееее :thinking: У тебя в кармане пусто!");
					else {
						var actBank = foundObj.retrocoinBank;
						var actCash = foundObj.retrocoinCash;
						var newCash = 0;

						foundObj.retrocoinCash = newCash;
						foundObj.retrocoinTotal = newCash + actBank;
						foundObj.save(function(err, updatedObj){
							if(err)
								console.log(err);
						})

						var avatar = message.member.user.avatarURL;
						var total = foundObj.retrocoinCash + foundObj.retrocoinBank;

						const embed = new Discord.RichEmbed()
						.setTitle(`Все ретрики отправлены на счет группировки! Новый баланс ${message.member.displayName}`)
						.setColor("#0000FF")
						.addField("Наличкой", `${numberWithCommas(foundObj.retrocoinCash)} ${retricIcon}`, true)
						.addField("В банке", `${numberWithCommas(foundObj.retrocoinBank)} ${retricIcon}`, true)

						message.channel.send({embed});
					}
				}
			}
		});

    var user_obj = await Gang.findOne({
      name: gangName
    }, function(err, foundObj){
      if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj)
					console.log("Something stange happend");
				else {
          var balance = foundObj.balance;
          var newbalance = balance + cash;
          foundObj.balance = newbalance;
          foundObj.save(function(err, updatedObj){
            if(err)
              console.log(err);
          })
        }
      }
    })
  }

  else if (isNumeric(args[0])){
    var toWith = Number(args[0]);
    var user_obj = await User.findOne({
      userID: message.member.id
    }, function (err, foundObj) {
      if (err)
        console.log("Error on database findOne: " + err);
      else {
        if (!foundObj)
          console.log("Something stange happend");
        else {
          var actBank = foundObj.retrocoinBank;
          var actCash = foundObj.retrocoinCash;
          var newCash = actCash - toWith;
            if(newCash < 0)
              message.reply(`у тебя нехватает ретриков на данное действие!`)
            foundObj.retrocoinCash = newCash;
            foundObj.retrocoinTotal = actBank + newCash;
            foundObj.save(function(err, updatedObj){
              if(err)
                console.log(err);
            })
            var avatar = message.member.user.avatarURL;
            var total = foundObj.retrocoinCash + foundObj.retrocoinBank;
            const embed = new Discord.RichEmbed()
            .setTitle(toWith + " ретриков отправлено на счет группировки! Новый баланс " + message.member.displayName)
            .setColor("#0000FF")
            .addField("Наличкой", `${numberWithCommas(foundObj.retrocoinCash)} ${retricIcon}`, true)
            .addField("В банке", `${numberWithCommas(foundObj.retrocoinBank)} ${retricIcon}`, true)

            message.channel.send({embed});
          }
        }
      })
      var user_obj = await Gang.findOne({
        name: gangName
      }, function (err, foundObj) {
        if (err)
          console.log("Error on database findOne: " + err);
        else {
          if (!foundObj)
            console.log("Something stange happend");
          else {
            var balance = foundObj.balance;
            var newbalance = balance + toWith;
            foundObj.balance = newbalance;
            foundObj.save(function(err, updatedObj){
							if(err)
								console.log(err);
						})
          }
        }
      })
    }
          else {
            return message.channel.send(`У тебя разве хватает ${retricIcon} (ретриков) на такое действие? :thinking:`);
          }
  }

module.exports.help = {
  name: "gangpay"
}
