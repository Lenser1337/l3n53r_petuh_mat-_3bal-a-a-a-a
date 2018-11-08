const Discord = require("discord.js");

function isNumeric(value) {
	return /^\d+$/.test(value);
}

module.exports.run = async (bot, message, args) => {

  var retricIcon = bot.emojis.find("name", "retric");

  // if(!message.member.hasPermission("MANAGE_MESSAGES"))
  //   return;

  if (!args[0]){
  	var min = 1;
  	var max = 6;
  	var result = Math.floor(Math.random() * (max - min + 1)) + min;
  	return message.channel.send(message.member + " крутанул 🎲 и выпало " + result);
  }

  else if (!args[1]){
  	var separator = "-";
  	var arrayOfNumbers = args[0].split(separator);
  	if (!isNumeric(arrayOfNumbers[0]) || !isNumeric(arrayOfNumbers[1]))
  		return message.channel.send("Че то я не понял :thinking: Пробуй от-до");
  	if (Number(arrayOfNumbers[1]) < Number(arrayOfNumbers[0]))
  		return message.channel.send("Ты числа местами не попутал? :thinking: ");
  	if (Number(arrayOfNumbers[1]) > Number(arrayOfNumbers[0])){
  		var min = Number(arrayOfNumbers[0]);
  		var max = Number(arrayOfNumbers[1]);
  		var result = Math.floor(Math.random() * (max - min + 1)) + min;
  		return message.channel.send(message.member + " крутанул 🎲 и выпало " + result);
  	}
  	else if (arrayOfNumbers[1] === arrayOfNumbers[0])
  		return message.channel.send("Это уже не рандом :smirk: ");
  	return message.channel.send("Я чего-то не допонял :thinking: ");
  }
  else
  	return message.channel.send("Я чего-то не допонял :thinking: ");
}

module.exports.help = {
	name: "roll"
}
