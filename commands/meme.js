module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const meme = require("memejs");

  const m = await message.channel.send(bot.lang.fun.meme.pleasewait);
  meme(function(data) {
    const str1 = bot.lang.fun.meme.requestedby.replace(
      "${message.author.tag}",
      message.author.tag
    );
    const str2 = bot.lang.fun.meme.title.replace(
      "${data.title[0]}",
      data.title[0]
    );
    const embed = new Discord.MessageEmbed()
      .setTitle(str1)
      .setDescription(str2)
      .setColor("RANDOM")
      .setImage(data.url[0]);
    m.edit({ embed });
  });
};
module.exports.help = {
  name: "meme",
  catégorie: "Fun",
  helpcaté: "fun"
};
