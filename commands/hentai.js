module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");

  if (!message.channel.nsfw) return message.reply(bot.lang.nsfw.hentai.nonsfw);

  let m = await message.channel.send(bot.lang.nsfw.hentai.wait);
  const g = require("superagent")
    .get(`https://nekobot.xyz/api/image`)
    .query({
      type: "hentai",
    })
    .end((err, res) => {
      let astr = bot.lang.nsfw.hentai.request.replace("${message.author.tag}", message.author.tag);
      let bstr = bot.lang.nsfw.hentai.notdisplay.replace("${res.body.message}", res.body.message);

      const result = new Discord.MessageEmbed()
        .setTitle(astr)
        .setDescription(bstr)
        .setImage(res.body.message)
        .setFooter(bot.lang.nsfw.hentai.serviceby);
      m.edit(result);
    });
};
module.exports.help = {
  name: "hentai",
  catégorie: "NSFW",
  helpcaté: "nsfw",
};
