module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const fetch = require("node-fetch");
  const { random } = require('../util/Util');

  const m = await message.channel.send(bot.lang.fun.meme.pleasewait);
/*  
  meme.meme(data => {
    const str1 = bot.lang.fun.meme.requestedby.replace(
      "${message.author.tag}",
      message.author.tag,
    );
    const str2 = bot.lang.fun.meme.title.replace(
      "${data.title[0]}",
      data.title[0],
    );
    const embed = new Discord.MessageEmbed()
      .setTitle(str1)
      .setDescription(str2)
      .setColor("RANDOM")
      .setImage(data.url[0]);
    m.edit({ embed });
  });*/

  const { data: { children } } = await fetch("https://www.reddit.com/r/dankmemes/top.json?sort=top&t=day&limit=500")
    .then((res) => res.json());
  const meme = random(children);

  console.log(meme);
  const embed = new Discord.MessageEmbed()
      .setTitle(meme.data.title)
      .setImage(meme.data.url)
      .setColor(0x9590EE)
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 64 }))
      .setFooter(`👍 ${meme.data.ups} | 👎 ${meme.data.downs}`);
    return message.reply({ embed });
};
module.exports.help = {
  name: "meme",
  catégorie: "Fun",
  helpcaté: "fun",
};
