const Discord = require("discord.js");
const fs = require("fs");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);
var questions = require('./../schemas/question_model.js');

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

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name)))
    return message.reply("похоже у тебя нехватка прав!").then(msg => msg.delete(10000));

  console.log('Content: ' + message.content);
  var fullstr = message.content.substring(message.content.indexOf(" ") + 1);
  console.log("result: " + fullstr);

  // var role_obj = role_salary.findOne({
  //   roleID: aRole.id
  // }, function (err, foundObj) {
  //   if (err)
  //   console.log("We don`t have this role in the database" + err);
  //   else {
  //     if (foundObj === null){
  //       var myData = new role_salary({
  //         roleID: aRole.id,
  //         roleName: role,
  //         salary: salary
  //       });
  //       myData.save()
  //       .then(item => {
  //         console.log('New item "'+itm+'" added to database');
  //       })
  //       .catch(err => {
  //         console.log("Error on database save: " + err);
  //       });
  //     }
  //     else {
  //       foundObj.roleID = aRole.id;
  //       foundObj.roleName = role;
  //       foundObj.salary = salary;
  //       if(err)
  //       console.log(err);
  //       foundObj.save(function(err, updatedObj){
  //         if(err)
  //         console.log(err);
  //       });
  //     }
  //   };
  //   return message.reply(`у "${role}" изменена зарплата!`).then(msg => msg.delete(10000));
  // });
}


module.exports.help = {
  name: "qa"
}
