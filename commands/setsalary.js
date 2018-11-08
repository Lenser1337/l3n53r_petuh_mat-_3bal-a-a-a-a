const Discord = require("discord.js");
const fs = require("fs");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var role_salary = require('./../schemas/role_model.js');

module.exports.run = async (bot, message, args) => {

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

  message.delete(3000);
  //лимит который нужно прописать во все комманды что бы никто другой пока что не использовал
  // if(!message.member.hasPermission("MANAGE_ROLES"))
  //   return;
  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name)))
    return message.reply("похоже у тебя нехватка прав!").then(msg => msg.delete(10000));

  message.delete().catch(O_o=>{});

  if(!args)
    return message.reply(`роль / зарплата`).then(msg => msg.delete(10000));
  var role = "";
  var salary = 0;
  
  if(message.cleanContent.indexOf('"') > -1){
    role = message.cleanContent.split('"', 2).pop();
    role = message.cleanContent.split('"', 2).pop();
    var newStr = message.cleanContent.split('"').pop();
    salary = newStr.split(" ", 2).pop();
  }
  else {
    salary = Number(args[1]);
    role = args[0];
    salary = Number(args[2]);
    role = args[1];
  }

  if(!args[0])
    return message.reply(`роль зарплата`).then(msg => msg.delete(10000));
  if(!args[1])
    return message.reply(`роль зарплата`).then(msg => msg.delete(10000));

  var aRole = message.guild.roles.find(`name`, role);

  if(!aRole)
    return message.reply("по-моему данной роли нету на сервере...");

  var role_obj = role_salary.findOne({
    roleID: aRole.id
  }, function (err, foundObj) {
    if (err)
      console.log("We don`t have this role in the database" + err);
    else {
      if (foundObj === null){
        var myData = new role_salary({
          roleID: aRole.id,
          roleName: role,
          salary: salary
        });
        myData.save()
        .then(item => {
          console.log('New item "'+itm+'" added to database');
        })
        .catch(err => {
          console.log("Error on database save: " + err);
        });
      }
      else {
        foundObj.roleID = aRole.id;
        foundObj.roleName = role;
        foundObj.salary = salary;
        if(err)
          console.log(err);
        foundObj.save(function(err, updatedObj){
          if(err)
            console.log(err);
        });
      }
    };


    return message.reply(`у "${role}" изменена зарплата!`).then(msg => msg.delete(10000));

  });
}


  module.exports.help = {
    name: "setsalary"
  }
