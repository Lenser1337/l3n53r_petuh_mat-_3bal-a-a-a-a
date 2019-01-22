const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function payTheUser(bot, message, args){
	var multiplier = 2;
	if (args[1] == "1-12" || args[1] == "13-24" || args[1] == "25-36")
		multiplier = 3;
	else if (isNumeric(args[1]))
		multiplier = 36;
	var toPay = Number(args[0]) * multiplier;

	var user_obj = User.findOne({userID: message.member.id}, function(err, found_user){
		if (err)
			console.log("WTF there is an error: " + err);
		else {
			if (!user_obj)
				console.log("User not found");
			else {
				found_user.retrocoinCash = found_user.retrocoinCash + toPay;
				found_user.save(function(err, updatedObj){});
				return message.reply("ты только что выиграл " + toPay + " ретриков!");
		}
	}});
}

function startTheProcess(bot, message, args, winners){

	//starting the random
	var min = 1;
	var max = 36;
	var res = Math.floor(Math.random() * (max - min + 1)) + min;
	var r = res.toString();
	var reds = ["1", "3", "5", "7", "9", "12", "14", "16", "18", "19", "21", "23", "25", "27", "30", "32", "34", "36"];
	
	if (reds.includes(r))
		message.reply("выпало " + r + " :red_circle:!").then(msg => msg.delete(4000));
	else
		message.reply("выпало " + r + " :black_circle:!").then(msg => msg.delete(4000));

	if (winners.includes(r) == true)
		payTheUser(bot, message, args);
	else {
		//roll loss animation
		return message.channel.send({
			files: [{
				attachment: 'https://retrobotproject.herokuapp.com/images/roulette_loss.gif',
				name: 'roulette_loss.gif'
			}]
		}).then(msg => msg.delete(2000));
	}
}

module.exports.run = async (bot, message, args) => {

	// var retricIcon = bot.emojis.find("name", "retric");
	// var nopeIcon = bot.emojis.find("name", "nope");
	// var bravoIcon = bot.emojis.find("name", "bravo");
	// var pepeIcon = bot.emojis.find("name", "pepe_hmm");
	var casino_channel = message.guild.channels.find(`name`, "🎰казино_экономика");

	if (message.channel.name != "🎰казино_экономика" && message.channel.name != "🌎general_bots"	&& message.channel.name != "🕵секретный_чат" && message.channel.name != "🍲комната_отдыха"){
		message.delete(3000);
		return message.reply(`в рулетку можно играть только в ${casino_channel}`).then(msg => msg.delete(10000));
	}

	//check if everything sent by user is viable
	if (isNumeric(args[0]) && (args[1])) {
		if (Number(args[0]) < 100)
			return message.reply("минимальная ставка - 100 ретриков!");
		if (isNumeric(args[1])){
			if(args[1] >= 1 || args[1] <= 36){
				var i = args[1].toString();
				winners.push(i);
			}
			else
				return message.reply("использование: ^roulette <сумма> <прогноз>. Минимальная ставка - 100 ретриков. Что-бы понять на что можно ставить, набери ^roulette-info");
		}
		else {
			var winners = [];
			if (args[1] == "красное" || args[1] == "red")
				winners.push("1", "3", "5", "7", "9", "12", "14", "16", "18", "19", "21", "23", "25", "27", "30", "32", "34", "36");
			else if (args[1] == "черное" || args[1] == "чёрное" || args[1] == "black")
				winners.push("2", "4", "6", "8", "10", "11", "13", "15", "17", "20", "22", "24", "26", "28", "29", "31", "33", "35");
			else if (args[1] == "1-12")
				winners.push("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12");
			else if (args[1] == "13-24")
				winners.push("13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24");
			else if (args[1] == "25-36")
				winners.push("25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36");
			else if (args[1] == "четное" || args[1] == "чётное")
				winners.push("2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "34", "36");
			else if (args[1] == "нечетное" || args[1] == "нечётное" || args[1] == "не чётное" || args[1] == "не четное")
				winners.push("1", "3", "5", "7", "9", "11", "13", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35");
			else
				return message.reply("использование: ^roulette <сумма> <прогноз>. Минимальная ставка - 100 ретриков. Что-бы понять на что можно ставить, набери ^roulette-info");
		}
	}
	else
		return message.reply("использование: ^roulette <сумма> <прогноз>. Минимальная ставка - 100 ретриков. Что-бы понять на что можно ставить, набери ^roulette-info");

	//find the user
	var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});

	if (typeof user_obj === 'undefined' || user_obj === null)
		return message.reply("пользователь не найден в базе");

	//check if the user is able to run roulette
	if (user_obj.retrocoinCash - Number(args[0]) < 0)
		return message.reply("у тебя не хватает ретриков на эту ставку!");

	//get his money
	var user_obj = User.findOne({userID: message.member.id}, function(err, found_user){
		if (err)
			console.log("WTF there is an error: " + err);
		else {
			if (!user_obj)
				console.log("User not found");
			else {
				found_user.retrocoinCash = found_user.retrocoinCash - Number(args[0]);
				found_user.save(function(err, updatedObj){});
		}
	}});

	//roll the first animation
	message.channel.send({
		files: [{
			attachment: 'https://retrobotproject.herokuapp.com/images/roulette.gif',
			name: 'roulette.gif'
		}]
	}).then(msg => msg.delete(6000));
	setTimeout(function(){
		startTheProcess(bot, message, args, winners);
	}, 6000);
}

module.exports.help = {
	name: "roulette"
}
