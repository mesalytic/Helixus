module.exports.run = async (bot, message, args, con) => {
  const moment = require("moment");
  const Discord = require("discord.js");

  const emojis = [];
  if (message.guild.emojis.cache.size !== 0) {
    message.guild.emojis.cache.forEach(r => {
      const emoji = bot.emojis.resolve(r.id);
      emojis.push(emoji);
    });
  }
  const emojisembed = [];
  if (emojis.length === 0) {
    emojisembed.push("Aucun emoji.");
  } else if (emojis.join(" ").length > 1000) {
    let emojislength = "";
    let status = false;
    for (let i = 0; i < emojis.length; i++) {
      if (emojislength.length > 1000 && status == false) {
        status = true;
        for (let index = 0; index < i - 2; index++) {
          emojisembed.push(emojis[index]);
        }
      }
      emojislength += emojis[i];
    }
    emojisembed.push("...");
  } else {
    emojisembed.push(emojis.join(" "));
  }

  let rlist;
  let rmap = "";

  message.guild.roles.cache.map(role => {
    if (role.id === message.guild.id) return;
    rmap += `${role.name}, `;
  });

  rmap = rmap.slice(0, -1);
  if (rmap.length < 1) rlist = "No role";
  if (rmap.length > 1000) rlist = `(${message.guild.roles.cache.size} roles)`;
  else rlist = rmap;

  const serverembed = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setColor("RANDOM")
    .setThumbnail(message.guild.iconURL())
    .addField(bot.lang.infos.serverinfo.owner, message.guild.owner, true)
    .addField(bot.lang.infos.serverinfo.id, message.guild.id, true)
    .addField(bot.lang.infos.serverinfo.total, message.guild.memberCount, true)
    .addField(
      "Bots",
      message.guild.members.cache.filter(member => member.user.bot).size,
      true,
    )
    .addField(
      bot.lang.infos.serverinfo.channels,
      message.guild.channels.cache.size,
      true,
    )
    .addField(bot.lang.infos.serverinfo.roles, message.guild.roles.cache.size, true)
    .addField(bot.lang.infos.serverinfo.rolelist, rlist, true)
    .addField(
      bot.lang.infos.serverinfo.createdat,
      `${moment(message.guild.createdTimestamp).format(
        bot.lang.infos.serverinfo.createddate,
      )}`,
      true,
    )
    .addField(
      bot.lang.infos.serverinfo.country,
      bot.lang.regions[message.guild.region],
      true,
    )
    .addField("Emojis", emojisembed.join(" "), true);
  // .addField('\u200B', emojis, true)
  message.channel.send(serverembed);
};
module.exports.help = {
  name: "serverinfo",
  aliases: ["si"],
  catégorie: "Infos",
};
