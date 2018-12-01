const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');
var Item = require('./../schemas/shop_model.js');
var Gang = require('./../schemas/gang_model.js');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

function drunk(message){
	var user_obj = User.findOne({
		userID: message.member.id
	}, function (err, foundObj) {
		if (err){
			console.log("Error on database findOne: " + err);
		}
		else {
			if (!foundObj)
				console.log("Something stange happend");
			else {
				foundObj.drunk = foundObj.drunk + 1;
				foundObj.save(function(err, updatedObj){
				if(err)
					console.log(err);
				});
				return message.channel.send(`<@${message.member.id}> ушёл в запой 🍾`).then(msg => msg.delete(10000));
			}
		}
	});
}

function set_new_gang_leader(user, message, bot, gangName){
	//setting leadership in user_obj
	var user_obj = User.findOne({userID: message.member.id}, function(err, found_user){
		if (err)
			console.log("WTF there is an error: " + err);
		else {
			if (!user_obj)
				console.log("User not found");
			else {
				found_user.leaderOf = gangName;
				found_user.save(function(err, updatedObj){
					if (err)
						console.log(err);
				});
			}
		}
	});
	//creating a new gang obj in collection
	var membersArray = [];
	var newGang = new Gang({
		name: gangName,
		level: 1,
		welcomeMessage: "",
		balance: 0,
		created: Date.now(),
		leaderID: message.member.id,
		otherMembers: membersArray
	});
	newGang.save()
	.then(item => {
		console.log('New gang added to database!');
	})
	.catch(err => {
		console.log("Error on database save: " + err);
	});

	if(message.guild.available){

		var min = 0;
		var max = 16777215;
		var roleColor = Math.floor(Math.random() * (max - min + 1)) + min;

		//create a new role and give it to the member
		message.guild.createRole({
			name: gangName,
		  color: roleColor,
			hoist: false,
			mentionable: true,
		}).then(role => message.member.addRole(role.id))
		.catch(console.error);
	}
}

function refound_user(user, message, bot){
	console.log("have to add the gang creation item back to the inventory");
	var user_obj = User.findOne({userID: message.member.id}, function(err, found_user){
		if (err)
			console.log("WTF there is an error: " + err);
		else {
			if (!user_obj)
				console.log("User not found");
			else {
				var newinv = user.inv;
				newinv.push("Крышевание вандалов 👥");
				found_user.inv = newinv;
				found_user.save(function(err, updatedObj){
					if (err)
						console.log(err);
				});
			}
		}
	});
}

function create_new_gang(user, message, bot){

	var filter = m => m.author.id === message.author.id;
	var reportChannel = message.guild.channels.find(`name`, "🌘reports_bots");

	message.reply("как хотел бы назвать группировку? (до 10 символов, у тебя 1 минута что бы ответить)").then(r => r.delete(60000)).catch(function(error) {
	  console.log(error);
	});

	//проверка есть ли такая группировка в базе
	message.channel.awaitMessages(filter, {
		max: 1,
		time: 60000
	}).then(collected => {
		if (collected.first().content.length <= 12 && collected.first().content.length > 2){
			var gangName = collected.first().content; //желательно чекнуть что бы были только буквы

			var gang_obj = Gang.findOne({name: gangName}, function(err, found_gang){
				if (err)
					console.log("WTF there is an error: " + err);
				else {
					if (!gang_obj)
						console.log("Gang not found");
					else {
						if (found_gang !== null && typeof found_gang !== 'undefined'){
							if (found_gang.name == gangName){
								message.reply("это название группировки уже занято! Выбери другое, пожалуйста.");
								return refound_user(user, message, bot);
							}
						}
						else{
							message.reply("создать группировку **" + gangName + "**? (да / нет)").then(r => r.delete(60000)).catch(function(error) {
								console.log(error);
							});
							message.channel.awaitMessages(filter, {
								max: 1,
								time: 60000
							}).then(collected => {
								if (collected.first().content == "да") {
									message.reply("теперь ты глава " + gangName + "!");
									console.log("[" + user.highestRole + "] " + user.displayName + " (" + user.userID + ") создал группировку " + gangName);
									set_new_gang_leader(user, message, bot, gangName);
									reportChannel.send("**" + user.displayName + "** [" + user.userID + "] только что создал " + gangName);
								}
								else if (collected.first().content == "нет") {
									message.reply("ну нет так нет, выбери что-то другое");
									refound_user(user, message, bot);
								}
								else{
									message.reply("нужно отвечать **да** или **нет**!");
									refound_user(user, message, bot);
								}
							}).catch(err => {
								message.reply("время вышло 2!");
								refound_user(user, message, bot);
							});
						}
					}
				}
			});
		}
		else if(collected.first().content.length > 12){
			message.reply("слишком длинное название!");
			refound_user(user, message, bot);
		}
		else if(collected.first().content.length <= 2){
			message.reply("слишком короткое название!");
			refound_user(user, message, bot);
		}
	}).catch(err => {
		message.reply("время вышло 1!");
		refound_user(user, message, bot);
	});
}

function useitem(user, item, message, bot){

	var azart = message.guild.roles.find(`name`, "Азартный игрок 🎲");
	var shuler = message.guild.roles.find(`name`, "Шулер 🎱");
	var boost5 = message.guild.roles.find(`name`, "Boost Pack +5% 💰");
	var kluch = message.guild.roles.find(`name`, "Ключ от 1-го номера");
	var ubegishe111 = message.guild.roles.find(`name`, 'Житель убежища "111"');
	var activist = message.guild.roles.find(`name`, "Активист 🔋");
	var club = message.guild.roles.find(`name`, "🍓Клубничный клуб🍓");
	var koren = message.guild.roles.find(`name`, "Коренной житель (lv.35)");
	var boost25 = message.guild.roles.find(`name`, "Boost Pack +25% 💰");
	var legend50 = message.guild.roles.find(`name`, "Легенда [50]");
	var boost50 = message.guild.roles.find(`name`, "Boost Pack +50% 💰");
	var boost75 = message.guild.roles.find(`name`, "Boost Pack +75% 💰");

	var user_obj = User.findOne({userID: message.member.id}, function(err, found_user){
		if (err)
			console.log("WTF there is an error: " + err);
		else {
			if (!user_obj)
				console.log("User not found");
			else {
				if (item.usable !== true)
					return message.reply("эту вещь нельзя так использовать :thinking:");
				if(item.itemName == "Чиммичанга 🥙")
					message.channel.send(`Ммммм... Как вкусно...`);
				else if (item.itemName == "Синт Кола ☕")
					message.channel.send(`Ай... Горячо... Но всё-равно вкусно)`)
				else if (item.itemName == "Дон Периньон 🍾"){
					message.channel.send(`<@${message.author.id}>, буль буль буль`);
					drunk(message);
				}
				else if (item.itemName == "Покупка роли: Азартный игрок 🎲"){
					message.member.addRole(azart.id);
					message.channel.send(`<@${message.author.id}>, ты получил(а) роль Азартный игрок 🎲`);
				}
				else if (item.itemName == "Покупка роли: Шулер 🎱"){
					message.member.addRole(shuler.id);
					message.channel.send(`<@${message.author.id}>, ты получил(а) роль Шулер 🎱`);
				}
				else if (item.itemName == "Boost Pack +5% 💰"){
					message.member.addRole(boost5.id);
					message.channel.send(`<@${message.author.id}>, теперь у тебя буст к прибыли 5%`);
				}
				else if (item.itemName == "Ключ от номера 🔑"){
					message.member.addRole(kluch.id);
					message.channel.send(`<@${message.author.id}>, ты получил(а) получил ключ от 1-ого номера`);
				}
				else if (item.itemName == "Пропуск в Убежище 111 💣"){
					message.member.addRole(ubegishe111.id);
					message.channel.send(`<@${message.author.id}>, теперь ты стал жителем убежища "111"`);
				}
				else if (item.itemName == "Покупка роли: **Активист** 🔋"){
					message.member.addRole(activist.id);
					message.channel.send(`<@${message.author.id}>, ты получил(а) роль **Активист** 🔋`);
				}
				else if (item.itemName == "Ключ к Клубничному чату 🍓"){
					message.member.addRole(club.id);
					message.channel.send(`<@${message.author.id}>, ты получил(а) роль 🍓Клубничный клуб🍓`);
				}
				else if (item.itemName == "Покупка роли: **Коренной житель (lv.35)**"){
					message.member.addRole(koren.id);
					message.channel.send(`<@${message.author.id}>, ты получил(а) роль Коренной житель (lv.35)`);
				}
				else if (item.itemName == "Boost Pack +25% 💰"){
					message.member.addRole(boost25.id);
					message.channel.send(`<@${message.author.id}>, теперь у тебя буст к прибыли 25%`);
				}
				else if (item.itemName == "Покупка роли: **Легенда (lv.50)**"){
					message.member.addRole(legend50.id);
					message.channel.send(`<@${message.author.id}>, ты получил(а) роль Легенда (lv.50)`);
				}
				else if (item.itemName == "Boost Pack +50% 💰"){
					message.member.addRole(boost50.id);
					message.channel.send(`<@${message.author.id}>, теперь у тебя буст к прибыли 50%`);
				}
				else if (item.itemName == "Boost Pack +75% 💰"){
					message.member.addRole(boost75.id);
					message.channel.send(`<@${message.author.id}>, теперь у тебя буст к прибыли 75%`);
				}
				else if (item.itemName == "Крышевание вандалов 👥"){
					create_new_gang(user, message, bot);
				}
				else {
					message.reply("ты только что (почти) юзанул " + item.itemName);
					var fakeuse = true;
				}
				var index = user.inv.indexOf(item.itemName);
				var newinv = user.inv;
				if (!fakeuse)
					newinv.splice(index, 1);
				found_user.inv = newinv;
				found_user.save(function(err, updatedObj){
					if (err)
						console.log(err);
				});
			}
		}
	});
}

module.exports.run = async (bot, message, args) => {

	var shop_channel = message.guild.channels.find(`name`, "💸основное_экономика");

	if (message.channel.name != "💸основное_экономика" && message.channel.name != "🌎general_bots" && message.channel.name != "🕵секретный_чат" && message.channel.name != "🍲комната_отдыха"){
		message.delete(3000);
		return message.reply(`использовать вещи можно только в ${shop_channel}`).then(msg => msg.delete(10000));
	}

	//message.delete().catch(O_o=>{});

	//ищем есть ли человек, который пытается что либо купить, у нас в базе
	var user_obj = await User.findOne({userID: message.member.id}, function(err, found_user){});

	if (typeof user_obj === 'undefined' || user_obj === null)
		return message.reply("пользователь не найден в базе");

	//парсим что человек пытается юзануть
	var item = message.content.split(" ").toString();
	var to_cut = item.indexOf(",");
	item = item.slice(to_cut + 1);
	item = item.replace(/,/g, " ");
	item = item.replace(/\s\s+/g, ' ');

	//Поиск данной вещи в магазине (для того что бы знать юзабелен ли этот итем)
	var item_obj = await Item.findOne({itemName: item}, function(err, found_item){});

	if (typeof item_obj === 'undefined' || item_obj === null)
		return message.reply("этой вещи больше нету в магазине");

	//ищем есть ли у человека этот итем

	if (user_obj.inv.includes(item) == false)
		return message.reply(`у тебя нету ${item}`);
	else
		useitem(user_obj, item_obj, message);
}

module.exports.help = {
	name: "use"
}
