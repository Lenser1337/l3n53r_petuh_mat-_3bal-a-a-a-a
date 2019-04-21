const { RichEmbed } = require('discord.js');

module.exports.run = (client, message, args) => {
  if (!message.guild) return;
  if (!message.member.permissions.has('MANAGE_GUILD')) return;
  if (message.deletable) message.delete().catch(console.error);
  if (args.join(' ').toLowerCase().startsWith(`--embed`) || args.join(' ').toLowerCase().endsWith(`--embed`) || args.join(' ').toLowerCase().startsWith('-e') || args.join(' ').toLowerCase().endsWith('-e')) {
    try {
      let text = args.join(' ');

      let footer = text.match(/"footer"\s*:\s*{\s*"text"\s*:\s*"((?:\\"|[^""\n])*)"\s*(,\s*"icon_url"\s*:\s*"((?:\\"|[^""\n])*)")?\s*}/si);
      let image = text.match(/"image"\s*:\s*"((?:\\"|[^""\n])*)"/si);
      let thumb = text.match(/"thumbnail"\s*:\s*"((?:\\"|[^""\n])*)"/si);
      let author = text.match(/"author"\s*:\s*{\s*"name"\s*:\s*"((?:\\"|[^""\n])*)"(\s*,\s*"url"\s*:\s*"((?:\\"|[^""\n])*)")?(\s*,\s*"icon_url"\s*:\s*"((?:\\"|[^""\n])*)")?\s*}/si);
      let title = text.match(/"title"\s*:\s*"((?:\\"|[^""\n])*)"/si);
      let url = text.match(/"url"\s*:\s*"((?:\\"|[^""\n])*)"/si);
      let description = text.match(/"description"\s*:\s*"((?:\\"|[^""\n])*)"/si);
      let color = text.match(/"colou?r"\s*:\s*(\d{1,9})/i);
      let timestamp = text.match(/"timestamp"(\s*:\s*(.+?))?/si);
      let fields = text.match(/"fields"\s*:\s*\[(.+?)\]/si);
      let plaintext = text.match(/"plaintext"\s*:\s*"((?:\\"|[^""\n])*)"/si);

      if (plaintext) plaintext = plaintext[1];
      else plaintext = '';

      let embed = new RichEmbed();

      if (footer) embed.setFooter(footer[1], footer[3])
      if (image) {
        embed.attachFile({
          attachment: image[1],
          file: image[1].substring(image[1].lastIndexOf('/') + 1)
        }).setImage('attachment://' + image[1].substring(image[1].lastIndexOf('/') + 1));
      }
      if (thumb) {
        if (!image) {
          embed.attachFile({
            attachment: thumb[1],
            file: thumb[1].substring(thumb[1].lastIndexOf('/') + 1)
          }).setThumbnail('attachment://' + thumb[1].substring(thumb[1].lastIndexOf('/') + 1));
        } else embed.setThumbnail(thumb[1]);
      }
      if (author) embed.setAuthor(author[1], author[5], author[3]);
      if (title) embed.setTitle(title[1]);
      if (url) embed.setURL(url[1]);
      if (description) embed.setDescription(description[1].replace(/\\n/g, '\n'));
      if (color) embed.setColor('#' + (+color[1]).toString(16));
      if (timestamp) {
        if (!timestamp[2]) embed.setTimestamp(new Date());
        else embed.setTimestamp(new Date(timestamp[2]));
      }
      if (fields) {
        fields[1].match(/{.+?}/gsi).forEach(e => {
          if (!e[1]) return;

          let matches = e.match(/{\s*"name"\s*:\s*"(.*?)"\s*,\s*"value"\s*:\s*"(.*?)"(\s*,\s*"inline"\s*:\s*(.+?)\s*)?\s*}/si);

          if (!matches) return;
          if (!matches[1] || !matches[2]) return;

          embed.addField(matches[1], matches[2], matches[4] === "true");
        });
      }
      message.channel.send(plaintext, {
        embed
      });
      message.delete().catch(O_o => {});
    } catch (e) {
      return message.channel.send(`Ошибка. Перепроверьте синтаксис своего сообщения или обратитесь к автору бота`);
    } finally {
      return;
    }
  };

  return message.channel.send(args.join(' '));
};

/*

{footer: <"Текст снизу">[, "ссылка на картинку"]}
{image: <ссылка на картинку>}
{thumbnail: <ссылка на картинку>}
{author: <"Текст сверху">[, "ссылка на картинку"]}
{title: <Заголовок>}
{url: <Ссылка для заголовка>}
{description: <Описание>}
{color: <цвет>}
{timestamp[: время в мс]}
{field: <"Заголовок блока", "Описание блока">[, inline]}

{footer: <"Текст снизу">[, "ссылка на картинку"]}\n{image: <ссылка на картинку>}\n{thumbnail: <ссылка на картинку>}\n{author: <"Текст сверху">[, "ссылка на картинку"]}\n{title: <Заголовок>}\n{url: <Ссылка для заголовка>}\n{description: <Описание>}\n{color: <цвет>}\n{timestamp[: время в мс]}\n{field: <"Заголовок блока", "Описание блока">[, inline]}

*/

module.exports.help = {
  name: "say"
}
