const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {

	message.delete().catch(O_o=>{});

	var pchannel = message.guild.channels.find(`name`, "📌правила");

<<<<<<< HEAD
	message.member.send(`Если ты не можешь понять что тут и как, прочти пожалуйста вкладку ${pchannel}, их ты сможешь найти в самом верху (слева).\n Если после десятков часов, проведенных за чтением правил, ясней не стало, спроси интересующий вопрос у ⭐Полицейский⭐, это модераторы нашего сервера, они помогут тебе.\n Надеемся, что здесь тебе понравится :innocent:`);
=======
	message.member.send(`Если ты не можешь понять что тут и как, прочти пожалуйста вкладку ${pchannel}, их ты сможешь найти в самом верху (слева).`);
	message.member.send(`Если после десятков часов, проведенных за чтением правил, ясней не стало, спроси интересующий вопрос у ⭐Полицейский⭐, это модераторы нашего сервера, они помогут тебе.`);
	message.member.send(`Надеемся, что здесь тебе понравится :innocent:`);
>>>>>>> 89eab25fa7e1e0e16ffa24acfb2ff43bbbd494f2

}

module.exports.help = {
  name: "hp"
}
