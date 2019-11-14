module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const { formatNumber } = require("../util/Util");
  const { get } = require("node-superfetch");

  const oArgs = args
    .slice(0)
    .join(" ")
    .split(" ");

  const user = oArgs[0];
  let mode;
  if (oArgs[1] === "standard") mode = 0;
  else if (oArgs[1] === "taiko") mode = 1;
  else if (oArgs[1] === "ctb") mode = 2;
  else if (oArgs[1] === "mania") mode = 3;
  else return message.reply(bot.lang.membres.osu.noargs);

  const { body } = await get("https://osu.ppy.sh/api/get_user").query({
    k: bot.config.osu,
    u: user,
    m: mode,
    type: "string"
  });

  if (!body.length) return message.channel.send(bot.lang.membres.osu["404"]);

  const data = body[0];

  const embed = new Discord.RichEmbed()
    .setAuthor(
      "osu!" + oArgs[1],
      "https://i.imgur.com/hWrw2Sv.png",
      "https://osu.ppy.sh/"
    )
    .setColor("RANDOM")
    .addField(bot.lang.membres.osu.username, data.username, true)
    .addField("ID", data.user_id, true)
    .addField(bot.lang.membres.osu.level, data.level || "???", true)
    .addField(
      bot.lang.membres.osu.accuracy,
      data.accuracy ? `${Math.round(data.accuracy)}%` : "???",
      true
    )
    .addField(
      bot.lang.membres.osu.rank,
      data.pp_rank ? formatNumber(data.pp_rank) : "???",
      true
    )
    .addField("PP", data.pp_raw ? formatNumber(data.pp_raw) : "???", true)
    .addField(
      bot.lang.membres.osu.totalgames,
      data.playcount ? formatNumber(data.playcount) : "???",
      true
    )
    .addField(bot.lang.membres.osu.country, data.country || "???", true)
    .addField(
      bot.lang.membres.osu.rankedscore,
      data.ranked_score ? formatNumber(data.ranked_score) : "???",
      true
    )
    .addField(
      bot.lang.membres.osu.totalscore,
      data.total_score ? formatNumber(data.total_score) : "???",
      true
    )
    .addField(
      "SSH",
      data.count_rank_ssh ? formatNumber(data.count_rank_ssh) : "???",
      true
    )
    .addField(
      "SS",
      data.count_rank_ss ? formatNumber(data.count_rank_ss) : "???",
      true
    )
    .addField(
      "SH",
      data.count_rank_ssh ? formatNumber(data.count_rank_sh) : "???",
      true
    )
    .addField(
      "S",
      data.count_rank_s ? formatNumber(data.count_rank_s) : "???",
      true
    )
    .addField(
      "A",
      data.count_rank_a ? formatNumber(data.count_rank_a) : "???",
      true
    );
    
  return message.reply(embed);
};
module.exports.help = {
  name: "osu",
  catégorie: "Membres",
  helpcaté: "membres"
};
