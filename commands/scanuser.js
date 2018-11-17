const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');

function getRoles(role, index) {
	console.log("Role: " + role.name);
    var rolename = role.name;
    return rolename;
}

module.exports.run = async (bot, message) => {

	var rolesArray = message.member.roles.map(id => id.id);

	let r1 = message.guild.roles.find(`name`, "Приезжий [1]");
	let r2 = message.guild.roles.find(`name`, "Безработный [2]");
	let r3 = message.guild.roles.find(`name`, "Вандал [3]");
	let r4 = message.guild.roles.find(`name`, "Уличный попрошайка [4]");
	let r5 = message.guild.roles.find(`name`, "Уборщик [5]");

	let r6 = message.guild.roles.find(`name`, "Мусорщик [6]");
	let r7 = message.guild.roles.find(`name`, "Шахтер [7]");
	let r8 = message.guild.roles.find(`name`, "Утилизатор [8]");
	let r9 = message.guild.roles.find(`name`, "Почтальон [9]");
	let r10 = message.guild.roles.find(`name`, "Блудный музыкант [10]");

	let r11 = message.guild.roles.find(`name`, "Мойщик машин [11]");
	let r12 = message.guild.roles.find(`name`, "Кассир на бензоколонке [12]");
	let r13 = message.guild.roles.find(`name`, "Аптечный фармацевт [13]");
	let r14 = message.guild.roles.find(`name`, "Развозчик пиццы [14]");
	let r15 = message.guild.roles.find(`name`, "Портовый рабочий [15]");

	let r16 = message.guild.roles.find(`name`, "Таксист [16]");
	let r17 = message.guild.roles.find(`name`, "Скаут [17]");
	let r18 = message.guild.roles.find(`name`, "Студент Хогретроста [18]");
	let r19 = message.guild.roles.find(`name`, "Вышибала в баре [19]");
	let r20 = message.guild.roles.find(`name`, "Бармен [20]");

	let r21 = message.guild.roles.find(`name`, "Официант [21]");
	let r22 = message.guild.roles.find(`name`, "Шеф-Повар [22]");
	let r23 = message.guild.roles.find(`name`, "Освоившийся [23]");
	let r24 = message.guild.roles.find(`name`, "Бизнесмен - самоучка [24]");
	let r25 = message.guild.roles.find(`name`, "IT Специалист [25]");

	let r26 = message.guild.roles.find(`name`, "Предприниматель [26]");
	let r27 = message.guild.roles.find(`name`, "Махинатор [27]");
	let r28 = message.guild.roles.find(`name`, "Секретарь Босса [28]");
	let r29 = message.guild.roles.find(`name`, "Офисный клерк [29]");
	let r30 = message.guild.roles.find(`name`, "Работник крупной компании [30]");

	let r31 = message.guild.roles.find(`name`, "Брокер [31]");
	let r32 = message.guild.roles.find(`name`, "Хозяин активов [32]");
	let r33 = message.guild.roles.find(`name`, "Майнер биткоина [33]");
	let r34 = message.guild.roles.find(`name`, "Завсегдатай [34]");
	let r35 = message.guild.roles.find(`name`, "Коренной житель [35]");

	let r36 = message.guild.roles.find(`name`, "Киберспортсмен [36]");
	let r37 = message.guild.roles.find(`name`, "Выходец из Ретро Велли [37]");
	let r38 = message.guild.roles.find(`name`, "Продюсер фильмов [38]");
	let r39 = message.guild.roles.find(`name`, "Бизнесмен [39]");
	let r40 = message.guild.roles.find(`name`, "Рожденный в Ретро Велли [40]");

	let r50 = message.guild.roles.find(`name`, "Легенда [50]");

	let aktivist = message.guild.roles.find(`name`, "Активист 🔋");

	if(!message.member.roles.some(r=>["Активист 🔋"].includes(r.name))){

		var user_obj = User.findOne({
			userID: message.member.id
		}, function (err, foundObj) {
			if (err)
				console.log("Error on database findOne: " + err);
			else {
				if (!foundObj)
					console.log("Перк Активист: Человека нет в базе!");
				else {
					if(foundObj.messages >= 10000){
						message.member.addRole(aktivist.id);
						message.channel.send(`Только что ${message.member.displayName} получил перк Активист!`)
					}
				}
			}
		});

	}

	var user_obj = User.findOne({
		userID: message.member.id
	}, function (err, foundObj) {
		if (err)
			console.log("Error on database findOne: " + err);
		else {
			if (foundObj === null){
				var myData = new User({
					userID: message.member.id,
					displayName: message.member.displayName,
					highestRole: message.member.highestRole.name,
					joinedAt: message.member.joinedAt,
					messages: 1,
					infractions: 0,
					retrocoinCash: 0,
					retrocoinBank: 0,
					retrocoinTotal: 0,
					kissed: 0,
					huged: 0,
					fcked: 0,
					hit: 0,
					killed: 0,
					drunk: 0,
					status: "__не установлен__",
					lastScan: Date.now()
				});
				myData.save()
				.then(item => {
					console.log('New user "' + message.member.displayName + '" added to database');
				})
				.catch(err => {
					console.log("Error on database save: " + err);
				});
			}
			else {
				if (!foundObj)
					console.log("Something stange happend");
				else {
					foundObj.mainmessages++;
					var dateTime = Date.now();
					var timestamp = Math.floor(dateTime/1000);
					var timestampLimit = Math.floor(foundObj.lastScan/1000) + 60;
					if (timestampLimit < timestamp) {

						// var userRoles = message.member.roles.array(getRoles);
						// console.log("Роли")
						// console.log("Roles: " + message.member.roles.array(role => console.log(role.name)))

						var min = 1;
						var max = 15;
						var coinrandom = Math.floor(Math.random() * (max - min + 1)) + min;
						foundObj.messages++;
						foundObj.retrocoinBank += coinrandom;
						foundObj.retrocoinTotal = foundObj.retrocoinCash + foundObj.retrocoinBank;
						foundObj.displayName = message.member.displayName;
						foundObj.highestRole = message.member.highestRole.name;
						foundObj.roles = rolesArray;
						foundObj.lastScan = Date.now();
						foundObj.save(function(err, updatedObj){
							if(err)
								console.log(err);
						})
					}
				}
			}
		}
	});
}

module.exports.help = {
	name: "scanuser"
}
