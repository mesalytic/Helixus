module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const moment = require("moment");

  const Timestamp = require('../util/Timestamp'),
  timestamp = new Timestamp("DD MMMM YYYY, HH:MM");

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
    .addField("Name", user.user.tag, true)
    .addField("ID", user.id, true)
    .addField("Discord Join Date", timestamp.display(user.user.createdAt), true)
    .addField("Server Join Date", user.joinedTimestamp ? timestamp.display(user.joinedTimestamp) : "Unknown", true)
    .addField("Nickname", user.nickname || "None", true)
    .addField("Bot ?", user.bot ? "Yes" : "No", true)
    .addField("Activity", uPresence)
    .addField(`Roles (${user.roles.cache.size})`, user.roles.cache.size ? `<@&${user.roles.cache.map(r => r.id).filter(r => r !== message.guild.roles.everyone.id).join(">, <@&")}>` : "None");
  
    message.channel.send(embed)
};
module.exports.help = {
  name: "userinfo",
  aliases: ["ui"],
  catégorie: "Infos",
  helpcaté: "infos",
};
