module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const { get } = require("snekfetch");
  if (!message.channel.nsfw) return message.reply(bot.lang.nsfw["4k"].nonsfw);

  let m = await message.channel.send(bot.lang.nsfw["4k"].wait);
  const { body } = await get("https://nekobot.xyz/api/image?type=4k");
  let astr = bot.lang.nsfw["4k"].request.replace(
    "${message.author.tag}",
    message.author.tag,
  );
  let bstr = bot.lang.nsfw["4k"].notdisplay.replace(
    "${body.message}",
    body.message,
  );
  let embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(astr, message.author.displayAvatarURL())
    .setDescription(bstr)
    .setImage(body.message)
    .setFooter(bot.lang.nsfw["4k"].serviceby);
  // console.log(body)
  m.edit(embed);
};
module.exports.help = {
  name: "4k",
  catégorie: "NSFW",
  helpcaté: "nsfw",
};
