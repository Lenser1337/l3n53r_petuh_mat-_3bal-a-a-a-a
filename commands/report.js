const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

// var D = new Date();

// var ye = 'FullYear';
// var mo = 'UTCMonth';
// var da = 'UTCDate';
// var ho = 'UTCHours';
// var mi = 'UTCMinutes';
// var se = 'UTCSeconds';
// var rm = 'января февраля марта апреля мая июня июля августа сентября октября ноября декабря'.split(' ');
// var az = function (x) {return (x < 10 ? '0' : '') + x};
// var vl = function (x) {return D ['get' + x] ()};

// var R = vl (da)  + ' ' + rm [vl (mo)] + ' ' +     vl (ye) + ' г., '
//   + az (vl (ho)) + ':' + az (vl (mi)) + ':' + az (vl (se));

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

    //лимит который нужно прописать во все комманды что бы никто другой пока что не использовал

    message.delete().catch(O_o=>{});

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let repchannel = message.guild.channels.find(`name`, "🌘reports_bots");
    let errorschannel = message.guild.channels.find(`name`, "🌏errors_bots");
    let reason = args.join(" ").slice(22);

    if(!rUser)
        return message.channel.send("Пользователь не существует!").then(msg => msg.delete(10000));
    if(!errorschannel)
        return message.channel.send("Канал ошибок не существует!").then(msg => msg.delete(10000));
    if(!repchannel)
        errorschannel.send("Канал репортов не существует!").then(msg => msg.delete(10000));
    if(!repchannel)
        return message.channel.send("Канал репортов не существует!").then(msg => msg.delete(10000));
    if(!reason)
        return message.channel.send("Укажите причину!").then(msg => msg.delete(10000));

    let embed = new Discord.RichEmbed()
    .setTitle("ЖАЛОБА")
    .setColor("#F76806")
    .addField("Жалоба на:", `${rUser}`, true)
    .addField("Жалобу подал:", `${message.author}`, true)
    .addField("Канал:", message.channel, true)
    .addField(`Время создания жалобы:`, formatDate(new Date()), true)
    .addField("Жалоба:", reason, true)

    message.channel.send(`${message.author}`+", жалоба отправлена!").then(msg => msg.delete(10000));

    message.delete().catch(O_o=>{});
    repchannel.send({embed});
}

module.exports.help = {
    name: "report"
}
