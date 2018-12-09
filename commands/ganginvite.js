const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {

  var inviteTarget = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  inviteTarget.sendMessage("Привет! message.member.displayName приграсил тебя вступить в gangName! Принять приглашение? (да/нет)");
  
}


module.exports.help = {
	name: "ganginvite"
}
