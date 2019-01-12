const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);
var Report = require('./../schemas/report_model.js');

//tempmute @member Time

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
  var wutIcon = bot.emojis.find("name", "wut");
  var wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  var police = message.guild.roles.find(`id`, "360650251243225090");
  var warnchannel = message.guild.channels.find(`id`, "533744644434165770");
  let reason = "";
  reason = args.join(" ").slice(22);

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "Комиссар Полиции"].includes(r.name)))
    return;
  if(!wUser)
    return message.reply(`пользователь не существует ${wutIcon}`);
  if(!message.member.roles.some(r=>["⭐Полицейский⭐"].includes(r.name)))
    return message.reply(`не, этот дядька не является копом ${wutIcon}`);
  if(!warnchannel)
    return message.channel.send("Канал репортов не существует!");
  if(reason === "")
    return message.reply("укажите причину!");

    var user_obj = Report.findOne({
    	moderID: wUser.id
    }, function (err, foundObj) {
    	if (err)
    		console.log("Error on database findOne: " + err);
    	else {
    		if (foundObj === null){
    			var myData = new Report({
    				moder: wUser.username,
    				moderID: wUser.id,
            warnsAmount: 0,
          	infractionsAmount: 0,
          	muteAmount: 0,
          	voicemuteAmount: 0,
          	resetedwarns: 0,
          	resetedinfractions: 0,
          	resetedmutes: 0,
          	resetedvoicemutes: 0,
          	rebuke: 0,
    			});
    			myData.save()
    			.then(item => {
    			})
    			.catch(err => {
    				console.log("Error on database save: " + err);
    			});
          return message.reply("у него и так 0 выговоров");
    		}else if (typeof foundObj.rebuke == 'undefined' || foundObj.rebuke == null){
        foundObj.rebuke = 0
        foundObj.save(function(err, updatedObj){
          if(err)
            console.log(err);
        });
        return message.reply("у него и так 0 выговоров");
        }else if (foundObj.rebuke <= 0){
        foundObj.rebuke = 0
        foundObj.save(function(err, updatedObj){
          if(err)
            console.log(err);
        });
        return message.reply("у него и так 0 выговоров");
        } else{
          foundObj.rebuke = foundObj.rebuke - 1;
       }
       foundObj.save(function(err, updatedObj){
         if(err)
           console.log(err);
       });
     }

     const embed = new Discord.RichEmbed()
     .setTitle(":star: УБРАН ВЫГОВОР :star:")
     .setColor("#fc6400")
     .addField("Счастливчик", `<@${wUser.id}>`, true)
     .addField("Выговор убрал", message.member, true)
     .addField("Выговор у счастливчика", foundObj.rebuke, true)
     .addField(`Время выдачи удаления выговора:`, formatDate(new Date()), true)
   });
       message.reply(`так точно, <@${wUser.id}> был удален 1 выговор!`);
       warnchannel.send(embed);
     }




module.exports.help = {
  name: "removepwarn"
}
