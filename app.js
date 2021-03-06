const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const ms = require("ms");
const YTDL = require("ytdl-core");
const isUrl = require("is-url");
var CronJob = require('cron').CronJob;
var router = express.Router();
var mongoose = require("mongoose");
bot.commands = new Discord.Collection();
var Spy = require('./schemas/spy_model.js');
var User = require('./schemas/user_model.js');
var servers = {};
var prefix = botconfig.prefix;
var dateTimenow = Date.now();

mongoose.Promise = global.Promise;mongoose.connect(process.env.MONGO_URL);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

var warns = require('./public/warnings.json');

app.use(express.static('public'));


// app.use("/", (req, res) => {
//  res.sendFile(__dirname + "/public/index.html");
// });

// GET роут
// app.get('/', function (req, res) {
//   app.use('/', indexpage);
// });

// app.get('/warnings', function (req, res) {
//   app.use('/warnings', warns);
// });

// POST роут
// app.post('/', function (req, res) {
//   res.send('/public/main/index.html');
// });

app.listen(process.env.PORT || 8080, () =>
  console.log("[app.js] Сайт запущен")
  );

fs.readdir("./commands/", (err, files) => {
  if (err)
    console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("[app.js] Команды не найдены");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`[app.js] Комманда ${f} загружена`);
    bot.commands.set(props.help.name, props);
  })
});

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if(server.queue[0])
      play(connection, message);
    else
      connection.disconnect();
  });
}

function idle_repeat(){
  console.log("[app.js] New CronJob started");

  var commandfile1 = bot.commands.get("rainbowcolor");
  commandfile1.run(bot);

  var cronindex = 1;
  var CronJob = require('cron').CronJob;
  new CronJob('0 * * * * *', function() {
    let i = (cronindex == 1) ? " minute" : " minutes";
    console.log("[app.js] CronJob: Bot is online for " + cronindex + i);
    cronindex++;
  }, null, true, 'Europe/Paris');

  let commandfile = bot.commands.get("salariespayement");
  new CronJob('0 0 0 * * *', function() {
    console.log("New payement process started by CronJob!");
    commandfile.run(bot);
  }, null, true, 'Europe/Paris');

  let scangang = bot.commands.get("scangangsandcleanall");
  new CronJob('0 0 * * * *', function() {
    console.log("Scaning gang start");
    scangang.run(bot);
  }, null, true, 'Europe/Paris');

  new CronJob('* * 0 * * *', function() {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var creationDate = new Date('2017-01-12T11:59:44');
    var todayDate = new Date();

    var diffDays = Math.round(Math.abs((creationDate.getTime() - todayDate.getTime())/(oneDay)));

    var statusname = "за сервером " + diffDays + " дней";
    bot.user.setPresence({
      game: {
        name: statusname,
        type: 3
      }
    });
  }, null, true, 'Europe/Paris');
}

function formatDate(date) {
  var monthNames = [
    "января", "февраля", "марта",
    "апреля", "мая", "июня", "июля",
    "августа", "сентября", "октября",
    "ноября", "декабря"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var time = hour + ":" + minute + ":" + second;

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ', ' + time;
}

bot.on("message", async message => {

  if(message.member == null){

  }
  else if(message.member.id == "510860999193001984" || message.member.id == "469472686314094592"){
    let spychannel = message.guild.channels.find(`id`, "509731878581043220");
    if (!spychannel || typeof spychannel == 'undefined')
      return console.log("no channel for reports found on server");
    let embed = new Discord.RichEmbed()
    .setTitle("Прослушка")
    .setColor("#4268E0")
    .addField("Подслушка за:", `${message.member.displayName}`, true)
    .addField("Сообщение:", `${message.content}`, true)
    .addField("В канале:", message.channel, true)
    .addField(`Время:`, formatDate(new Date()), true)
    spychannel.send({embed});
  }

  //кадеты 435385934914256897 и велопатруль 479575578123567104

  else if(message.member.roles.some(r=>["435385934914256897", "479575578123567104"].includes(r.id))){
    let spychannel = message.guild.channels.find(`id`, "509731878581043220");
    if (!spychannel || typeof spychannel == 'undefined')
      return console.log("no channel for reports found on server");
    let embed = new Discord.RichEmbed()
    .setTitle("Прослушка")
    .setColor("#4268E0")
    .addField("Подслушка за:", `${message.member.displayName}`, true)
    .addField("Сообщение:", `${message.content}`, true)
    .addField("В канале:", message.channel, true)
    .addField(`Время:`, formatDate(new Date()), true)
    spychannel.send({embed});
  }


  if(message.channel.type === "dm"){
    if(typeof message.author == 'undefined' || message.author == null)
      return;
    if (message.author.id == "510161189871943701")
      return;
    var user_obj = User.findOne({
			userID: message.author.id
  	}, function (err, foundObj) {
  		if (err){
  			console.log("Error on database findOne: " + err);
			}
   		 else {
  			if (!foundObj)
  				console.log("Something stange happend");
				else {
          if(foundObj.findOpen == true)
           return;
         }
       }
     });
    var dmchannel = bot.channels.find(`id`, "531815935544131594");
    if (!dmchannel || typeof dmchannel == 'undefined')
      return console.log("no channel for DMchat found on server");
      return dmchannel.send({embed: {
        color: 3447003,
        title: `Сообщение в ЛС...`,
        fields: [
        {
          name: `Сообщение`,
          value: message.content
        }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: message.author.avatarURL,
          text: `${message.author.username}`
        }
      }
 });
}
});



bot.on("message", async message => {

  if(typeof message.member == 'undefined' || message.member == null)
    return;

  let cazino = message.guild.channels.find(`name`, "🎰казино_экономика");
  let main = message.guild.channels.find(`name`, "💸основное_экономика");
  let eRole = message.guild.roles.find(`name`, "Игрок: Экономика 💰");
  let eMember = message.member;

  if(message.channel == cazino || message.channel == main){
    if(message.member.roles.some(r=>["Игрок: Экономика 💰", "⭐Полицейский⭐", "⭐Шерифский департамент⭐", "Бездушные", "RetroBot", "Губернатор"].includes(r.name)))
      return;
    await(eMember.addRole(eRole.id));
  }

});

bot.on('guildMemberAdd', member => {
  let newuser = member
  var User = require('./schemas/user_model.js');
  var user_obj = User.findOne({
    userID: newuser.id
  }, function (err, foundObj) {
    if (err)
     console.log("Error on database findOne: " + err);
   else {
     if (foundObj === null){
      var myData = new User({
       userID: newuser.id,
       displayName: newuser.displayName,
       highestRole: newuser.highestRole.name,
       joinedAt: newuser.joinedAt,
       messages: 0,
       mainmessages: 0,
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
       console.log('New user "' + newuser.displayName + '" added to database');
     })
      .catch(err => {
       console.log("Error on database save: " + err);
     });
    }
    else {
      if (!foundObj)
       console.log("Something stange happend");

   }
 }
});
});

bot.on('guildMemberAdd', member => {
    member.guild.channels.get('428699837408608256').send(':purple_heart: **' + member.user.username + '**, переехал в наш город! :purple_heart:');
});

bot.on('guildMemberRemove', member => {
    member.guild.channels.get('428699837408608256').send(':broken_heart: **' + member.user.username + '**, собрал шмотки и покинул наш город! :broken_heart:');
});

//Выполняеться когда бот готов к работе
bot.on("ready", async () => {
  //Консоль лог что бот онлайн
  console.log(`[app.js] ${bot.user.username} онлайн`);
  //Установка игры
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  var creationDate = new Date('2017-01-12T11:59:44');
  var todayDate = new Date();

  var diffDays = Math.round(Math.abs((creationDate.getTime() - todayDate.getTime())/(oneDay)));

  var statusname = "за сервером " + diffDays + " дней";
  bot.user.setPresence({
    game: {
      name: statusname,
      type: 3
    }
  });
  //Установка статуса
  bot.user.setStatus('online');
  idle_repeat();
});


//Выполняеться когда кто-то пишет сообщение
bot.on("message", async message => {

  if(message.author.bot){
    if(message.member != null){
      if(message.member.roles.some(r=>["Mantaro","Napstabot","Astolfo","Vexera"].includes(r.name))){
        if(message.channel.name == "📵канализация"){
          message.delete()
          .then(msg => console.log(`Удалено сообщение от ${msg.author.username}`))
          .catch(console.error);
        }
      }
    }
    return;
  }

  if(message.author.bot){
    if(message.member != null){
      if(message.member.id == "280497242714931202"){
        if(message.channel.name == "💬общение"){
          message.delete()
          .then(msg => console.log(`Удалено сообщение от ${msg.author.username}`))
          .catch(console.error);
        }
      }
    }
    return;
  }

  // if(message.channel.name == "📵канализация")
  //   return;

  // if(message.content == "^find" && message.channel.name == "👋поиск_напарников" && !message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "RetroBot", "⭐Полицейский⭐"].includes(r.name)))
  //   return message.delete().catch(O_o=>{}) message.member.send("Для того чтоб найти себе напарника напиши в любой чат команду ^find.");

  // if(message.content != "^find" && message.channel.name == "👋поиск_напарников" && !message.member.roles.some(r=>["Тех. Администратор", "Губернатор", "RetroBot", "⭐Полицейский⭐"].includes(r.name))){
  //   message.delete().catch(O_o=>{});
  //   message.member.send("Для того чтоб найти себе напарника напиши в любой чат команду **^find**");
  //   return message.member.send("Для того, что-бы значительно увеличить шансы найти кого-то советую сперва зайди в голосовой канал!");
  // }

  if (message.content.charAt(0) === prefix){
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    var args = messageArray.slice(1);
    let commandfile = bot.commands.get(cmd.slice(prefix.length));

    if(commandfile){
      commandfile.run(bot, message, args);
    }
  }
  else if (message.content.charAt(0) === "!" && message.content.charAt(1) === "w" && message.content.charAt(2) === "a"
   && message.content.charAt(3) === "r" && message.content.charAt(4) === "n"){
    let messageArray = message.content.split(" ");
  let cmd = "!warn2";
  var args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));

  if(commandfile){
    commandfile.run(bot, message, args);
  }
}
else if (message.content.charAt(0) === "?" && message.content.charAt(1) === "s" && message.content.charAt(2) === "e"
 && message.content.charAt(3) === "l" && message.content.charAt(4) === "l" && message.content.charAt(5) === "-"
 && message.content.charAt(6) === "i" && message.content.charAt(7) === "t" && message.content.charAt(8) === "e"
 && message.content.charAt(9) === "m"){
  let messageArray = message.content.split(" ");
let cmd = "!sellscan";
var args = messageArray.slice(1);
let commandfile = bot.commands.get(cmd.slice(prefix.length));

if(commandfile){
  commandfile.run(bot, message, args);
}
}
else if (message.content.charAt(0) === "?" && message.content.charAt(1) === "s" && message.content.charAt(2) === "e"
 && message.content.charAt(3) === "l" && message.content.charAt(4) === "l"){
  let messageArray = message.content.split(" ");
let cmd = "!sellscan";
var args = messageArray.slice(1);
let commandfile = bot.commands.get(cmd.slice(prefix.length));

if(commandfile){
  commandfile.run(bot, message, args);
}
}
else {
  let cmd = "scanuser";
  let commandfile = bot.commands.get(cmd);
  if(commandfile){
    commandfile.run(bot, message);
  }
}

});

bot.on("message", async message => {

  if(message.member && !message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name)))
    return;

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  var args = messageArray.slice(1);

  if((message.content.charAt(0) === prefix && cmd == prefix+"play") || (message.content.charAt(0) === prefix && cmd == prefix+"p")){
    let link = args[0];
    if(!link)
      return message.reply("похоже вы забыли ввести ссылку на трек");
    if(isUrl(link) !== true)
      return message.reply("введите ссылку а не что попало!");
    if(!message.member.voiceChannel)
      return message.reply("вы не в голосовом канале!");
    if(!servers[message.guild.id]) servers[message.guild.id] = {
      queue: []
    };
    var server = servers[message.guild.id];
    server.queue.push(args[0]);
    console.log("Queue is: " + server.queue);
    if(!message.guild.voiceConnection)
      message.member.voiceChannel.join().then(function(connection) {
        play(connection, message);
      });
  }

  if(message.content == prefix + "skip" || message.content == prefix + "s"){

    var server = servers[message.guild.id];

    if(server.dispatcher)
      server.dispatcher.end();
  }

  if(message.content == prefix + "disconnect" || message.content == prefix + "dis"){

    var server = servers[message.guild.id];

    if(message.guild.voiceConnection)
      message.guild.voiceConnection.disconnect();
  }

});

bot.login(process.env.BOT_TOKEN);
