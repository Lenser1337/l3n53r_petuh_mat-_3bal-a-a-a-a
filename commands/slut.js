const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);
var User = require('./../schemas/user_model.js');


// function isNumeric(value) {
// 	return /^\d+$/.test(value);
// }

function random(min, max) {
	var result = Math.floor(Math.random() * (max - min + 1)) + min;
	return (result);
}

const NumberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.run = async (bot, message, args) => {

	var shop_channel = message.guild.channels.find(`name`, "🍓клубничный_клуб");

	//🕵секретный_чат / 🍲комната_отдыха

	if (message.channel.name != "🍓клубничный_клуб"){
		message.delete(3000);
			return message.reply(`продавать себя можно только в ${shop_channel}`).then(msg => msg.delete(10000));
		}

	message.delete().catch(O_o=>{});

	if(!message.member.roles.some(r=>["🍓Клубничный клуб🍓", "🚨РетроТестер🚨", "Тех. Администратор", "Губернатор"].includes(r.name)))
		return;

	var retricIcon = bot.emojis.find("name", "retric");
	var simpleIcon = bot.emojis.find("name", "this_is_simple");

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

				var resultOfCrime = random(1, 100);

				var dateTime = Date.now();
				var timestamp = Math.floor(dateTime/1000);
				if (foundObj.lastSlutResult == true)
					var timestampLimit = Math.floor(foundObj.lastSlut/1000) + 5400;
				else
					var timestampLimit = Math.floor(foundObj.lastSlut/1000) + 1800;


				if (timestampLimit > timestamp)
					return message.reply(`твой дружок слишком устал... Отдохни еще немного ${simpleIcon}`).then(msg => msg.delete(10000));

				var toPay = random(700, 1500);

				if (resultOfCrime <= 40){
					var newCash = foundObj.retrocoinCash + toPay;
				}
				else{
					if(foundObj.retrocoinCash >= 0){
						toPay = Math.floor(foundObj.retrocoinTotal / 100 * 15);
						var newCash = foundObj.retrocoinCash - toPay;
					}
					else{
						toPay = Math.floor(foundObj.retrocoinTotal / 100 * (-15));
						var newCash = foundObj.retrocoinCash - toPay;
					}
				}

				foundObj.retrocoinCash = newCash;
				foundObj.retrocoinTotal = foundObj.retrocoinBank + newCash;
				foundObj.lastSlut = dateTime;

				var answers = [];
				answers.push(`ты пришёл к местному наркобарону и начал наяривать ему! Руки болят но ${NumberWithCommas(toPay)} ${retricIcon} уже в кармане!`);
				answers.push(`бабушка вызвала мужа на час, но она вовсе не хотела чтобы ты ей чинил кран! Забирай свои ${NumberWithCommas(toPay)} ${retricIcon}!`);
				answers.push(`тебе попался человек со странным вкусом который заставил тебя засовывать ему в задницу шнур...Держи свои ${NumberWithCommas(toPay)} ${retricIcon}!`);
				answers.push(`ты пришёл в местный клуб карате. Как оказалось у тренера день рождения и они решили пустить тебя по кругу. Попка болит но ${NumberWithCommas(toPay)} ${retricIcon} ты заработал!`);
				answers.push(`приехав на очередной вызов ты привёз с собой дилдо! Твоему клиенту понравилось, новый опыт. Бери ${NumberWithCommas(toPay)} ${retricIcon}!`);
				answers.push(`твой рот хорошо поработал этой ночью, твой сутенер будет доволен и дал тебе за это ${NumberWithCommas(toPay)} ${retricIcon}!`);
				answers.push(`ты пошел в клуб и по занимался сексом, тебе оставили ${NumberWithCommas(toPay)} ${retricIcon}!`);
				answers.push(`ты вышел на трассу подзаработать, но ты избил шлюху и украл ${NumberWithCommas(toPay)} ${retricIcon}!`);
				answers.push(`заняться ЭТИМ в туалете было немного стыдным, но главное что заплатили ${NumberWithCommas(toPay)} ${retricIcon}!`);

				var answers2 =[];
				answers2.push(`ты пошел в клуб и позанимался сексом, ты забеременял и пошел сделал аборт за ${NumberWithCommas(toPay)} ${retricIcon}`);
				answers2.push(`ты вышел на трасу подзаработать, но у тебя спёрла шлюха ${NumberWithCommas(toPay)} ${retricIcon}`);
				answers2.push(`ты хотел новых ощущений, но посещение проктолога стоит ${NumberWithCommas(toPay)} ${retricIcon}`);
				answers2.push(`твой дружок тебя подвел, по договору ты должен ${NumberWithCommas(toPay)} ${retricIcon} сутенёру...`);
				answers2.push(`когда ты ехал за рулём, наяривая своему другу рукой, ты попал в аварию... За ремонт машины ты отдал ${NumberWithCommas(toPay)} ${retricIcon}`);
				answers2.push(`ты подцепил на одном концерте девчонку, но у нее оказался ВИЧ. Теперь только по больницам гонять, последний осмотр обошелся в ${NumberWithCommas(toPay)} ${retricIcon}`);
				answers2.push(`твоя "коллега" одолжила у тебя ${NumberWithCommas(toPay)} ${retricIcon} пока вы работали на панели, но так и не вернула`);
				answers2.push(`ты думал тебе попалась мама Стифлера, а на самом деле Сьюзан Бойл! Еще и новую челюсть за ${NumberWithCommas(toPay)} ${retricIcon} купить пришлось...`);


				if (resultOfCrime <= 40){
					var index = Math.floor((Math.random() * answers.length));
					var answer = answers[index];
					foundObj.lastSlutResult = true;
				}
				else {
					var index = Math.floor((Math.random() * answers2.length));
					var answer = answers2[index];
					foundObj.lastSlutResult = false;
				}

				message.reply(answer).then(msg => msg.delete(10000));

				foundObj.save(function(err, updatedObj){
					if(err)
						console.log(err);
				});
			}
		}
	});
}

module.exports.help = {
	name: "slut"
}
