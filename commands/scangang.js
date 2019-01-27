const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');
var Gang = require('./../schemas/gang_model.js');

function deletegang(gang) {
  var gang_obj = Gang.deleteOne({
    name: gang.name
  }, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
}

function removerole(userID, role) {
var user = message.guild.members.find("id", userID);
user.removeRole(role);
var user_obj = User.findOne({
  userID: userID
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

function checklevel(gang) {
  var dateTime = Date.now();
  var timestampLimit = Math.floor(gang.created/1000) + 3600;
  var gangRole = message.guild.roles.find(`name`, gang.name);
  if (gang.level = 1 && dateTime >= timestampLimit){
   deletegang(gang);
   gang.otherMembers.forEach(function(user_id) {
  removerole(user_id, gangRole);
   });
 }
}
module.exports.run = async (bot, message, args) => {
  var gangs = Gang.find().lean().exec(function(err, gangstab) {});
  if (gangs == null || typeof gangs == "undefined")
  return console.log("gangs is undefined");
  gangs.forEach(function(gang) {
    checklevel(gang);
  });
}

module.exports.help = {
	name: "scangang"
}
