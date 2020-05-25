module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const moment = require("moment");

  const Timestamp = require('../util/Timestamp'),
  timestamp = new Timestamp("DD/MM/YYYY, HH:MM");

  let user = message.member;
  if (message.mentions.members.first()) user = message.mentions.members.first();


  let uPresence;
    if (user.user.presence.activities[0]) {
      if (user.user.presence.activities[0].type === "CUSTOM_STATUS") {
        uPresence = `**Custom Status:** ${user.user.presence.activities[0].state}`;
      } else { uPresence = user.user.presence.activities[0].name; }
    } else { uPresence = bot.lang.infos.userinfo.none; }


  let embed = new Discord.MessageEmbed()
    .setColor(user.displayHexColor ? user.displayHexColor : "RANDOM")
    .setTimestamp()
    .setThumbnail(user.user.displayAvatarURL())
    .addField(bot.lang.infos.userinfo.name, user.user.tag, true)
    .addField("ID", user.id, true)
    .addField(bot.lang.infos.userinfo.discordjoindate, timestamp.display(user.user.createdAt), true)
    .addField(bot.lang.infos.userinfo.serverjoindate, user.joinedTimestamp ? timestamp.display(user.joinedTimestamp) : bot.lang.infos.userinfo.unknown, true)
    .addField(bot.lang.infos.userinfo.nickname, user.nickname || "None", true)
    .addField("Bot ?", user.bot ? "Yes" : "No", true)
    .addField(bot.lang.infos.userinfo.activity, uPresence)
    .addField(`${bot.lang.infos.userinfo.roles} (${user.roles.cache.size})`, user.roles.cache.size ? `<@&${user.roles.cache.map(r => r.id).filter(r => r !== message.guild.roles.everyone.id).join(">, <@&")}>` : bot.lang.infos.userinfo.none);
  
    message.channel.send(embed)
};
module.exports.help = {
  name: "userinfo",
  aliases: ["ui"],
  catégorie: "Infos",
  helpcaté: "infos",
};
