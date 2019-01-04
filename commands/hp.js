const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {

	message.delete().catch(O_o=>{});

	var pchannel = message.guild.channels.find(`name`, "👋поиск_напарников");
	var policerole = message.guild.roles.find(role => role.name === "⭐Полицейский⭐");

	message.member.send(`Если ты не можешь понять что тут и как, прочти пожалуйста вкладку ${pchannel}, их ты сможешь найти в самом верху (слева).`);
	message.member.send(`Если после десятков часов, проведенных за чтением правил, ясней не стало, спроси интересующий вопрос у ${policerole.mention()}, это модераторы нашего сервера, они помогут тебе.`);
	message.member.send(`Надеемся, что здесь тебе понравится :innocent:`);

}

module.exports.help = {
  name: "hp"
}
