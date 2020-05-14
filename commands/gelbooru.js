module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const { get } = require("node-superfetch");
  const moment = require("moment");

  if (!message.channel.nsfw)
    return message.reply(bot.lang.nsfw.gelbooru.nonsfw);

  const query = args.join(" ");
  const random = str => Math.floor(Math.random() * str.length);

  let m = await message.channel.send(bot.lang.nsfw.gelbooru.wait);

  try {
    const { body } = await get("https://gelbooru.com/index.php").query({
      page: "dapi",
      s: "post",
      q: "index",
      json: 1,
      tags: query,
      limit: 200,
    });
    if (!body) return message.reply(bot.lang.nsfw.gelbooru.noresults);
    let data = body[random(body)];
    let rank;
    switch (data.rating) {
      case "q":
        rank = bot.lang.nsfw.gelbooru.q;
        break;
      case "s":
        rank = bot.lang.nsfw.gelbooru.s;
        break;
      case "e":
        rank = bot.lang.nsfw.gelbooru.e;
        break;
    }

    moment.locale("fr");
    const duration = moment(new Date(data.created_at).getTime()).format(
      "D MM YYYY [a] H:mm:s",
    );
    let astr = bot.lang.nsfw.gelbooru.request.replace(
      "${message.author.tag}",
      message.author.tag,
    );
    let bstr = bot.lang.nsfw.gelbooru.result
      .replace("${data.owner}", data.owner)
      .replace("${rank}", rank)
      .replace("${data.score}", data.score)
      .replace("${data.tags}", data.tags)
      .replace("${data.file_url}", data.file_url)
      .replace("${duration}", duration);
    const result = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(astr)
      .setDescription(bstr)
      .setImage(data.file_url);
    m.edit(result);
  } catch (err) {
    throw new Error(err);
  }
};
module.exports.help = {
  name: "gelbooru",
  catégorie: "NSFW",
  helpcaté: "nsfw",
};
