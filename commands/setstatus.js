const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

	//лимит который нужно прописать во все комманды что бы никто другой пока что не использовал
  // if(!message.member.hasPermission("MANAGE_MESSAGES"))
  //   return;

  if(!message.member.roles.some(r=>["Тех. Администратор", "Губернатор"].includes(r.name)))
    return;

  message.delete().catch(O_o=>{});

  let bstatus = args[0];
  if(!bstatus)
    return message.reply("статус не указан!");

  //if(status == "online" || status == "idle" || status == "invisible" || status == "invis" || status == "dnd")


  if(bstatus == 'online'){
    bot.user.setStatus('online');

  }else if(bstatus == 'idle'){
    bot.user.setStatus('idle');

  }else if(bstatus == 'invisible' || bstatus == 'invis'){
    bot.user.setStatus('invisible');

  }else if(bstatus == 'dnd'){
    bot.user.setStatus('dnd');

  }else{
    return message.reply("не верный статус! (online/idle/invis/dnd)");
  }

}

module.exports.help = {
	name: "setstatus"
}
