const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');
var Gang = require('./../schemas/gang_model.js');

function deleteGang(gang) {
  var gang_obj = Gang.deleteOne({
    name: gang.name
  }, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
}

function removeGangFromUser(user_id, role) {
  var user = message.guild.members.find("id", user_id);

  user.removeRole(role);
  var user_obj = User.findOne({
    userID: user_id
  }, function (err, foundObj) {
    if (err)
      console.log("Error on database findOne: " + err);
    else {
      foundObj.gang = null;
      foundObj.save(function(err, updatedObj){
        if(err)
          console.log(err);
      });
    }
  });
}

function removeGangFromLeader(user_id, role) {
  var user = message.guild.members.find("id", user_id);

  user.removeRole(role);
  var user_obj = User.findOne({
    userID: user_id
  }, function (err, foundObj) {
    if (err)
      console.log("Error on database findOne: " + err);
    else {
      foundObj.gang = null;
      foundObj.leaderOf = null;
      foundObj.save(function(err, updatedObj){
        if(err)
          console.log(err);
      });
    }
  });
}

function checkGang(gang) {

  var dateTime = Date.now();
  var timestampLimit = Math.floor(gang.created/1000) + 3600;
  var gangRole = message.guild.roles.find(`name`, gang.name);
  if (gang.level = 1 && dateTime >= timestampLimit){
    deleteGang(gang);
    gang.otherMembers.forEach(function(user_id) {
      removeGangFromUser(user_id, gangRole);
    });
    var leader = message.guild.members.find("id", gang.leaderID);
    leader.sendMessage("У тебя удалена группировка из-за недостатка участников! Как и предупреждалось, нужно было набрать 5 человек в течении часа... Увы!");
    removeGangFromLeader(user_id, gangRole);
    console.log("Successfully deleted gang: " + gang.name);
  }
}

module.exports.run = async (bot, message, args) => {

  var gangs = Gang.find({level:1}).lean().exec(function(err, gangstab) {
    if(err)
      console.log(err);
    else{
      if (gangstab == null || typeof gangstab == "undefined")
        return console.log("gangs is undefined");
      else
        console.log("length is: " + gangstab.length);

      gangstab.forEach(function(gang) {
        checkGang(gang);
      });
    }
  });
  // var leha = message.guild.members.find("id", "215970433088880641");
  // var sema = message.guild.members.find("id", "354261484395560961");
  // var bodya = message.guild.members.find("id", "358212316975726603");
  // var gangRole = message.guild.roles.find(`name`, foundObj.name);
  // leha.sendMessage(`У <@${message.member.id}> только что удалилась группировка ${foundObj.name}!`);
  // sema.sendMessage(`У <@${message.member.id}> только что удалилась группировка ${foundObj.name}!`);
  // bodya.sendMessage(`У <@${message.member.id}> только что удалилась группировка ${foundObj.name}!`);
}

module.exports.help = {
	name: "scangang"
}
