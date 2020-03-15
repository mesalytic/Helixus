module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  let modlog;

  con.query(
    `SELECT * FROM ModlogsChannel WHERE guildID='${message.guild.id}'`,
    (err, rows) => {
      if (!rows[0]) {
        message.channel.send(bot.lang.mods.ban.channotdefined);
        modlog = message.channel;
      } else modlog = message.guild.channels.resolve(rows[0].channelID);
    }
  );
  if (!message.channel.permissionsFor(message.author).has("BAN_MEMBERS"))
    return message.channel.send(bot.lang.mods.ban.unotperm);
  if (!message.channel.permissionsFor(bot.user).has("BAN_MEMBERS"))
    return message.channel.send(bot.lang.mods.ban.bnotperm);

  if (message.mentions.users.size === 0)
    return message.channel.send(bot.lang.mods.ban.noment);

  var member = message.mentions.members.first();
  if (member.permissions.has("BAN_MEMBERS"))
    return message.reply(bot.lang.mods.ban.notposs);

  let reason = args.slice(1).join(" ");
  if (!reason) reason = bot.lang.mods.ban.noreason;

  member
    .ban({ days: 7, reason: reason })
    .then(member => {
      message.channel.bulkDelete(1);
      message.channel.send(
        bot.lang.mods.ban.banned
          .replace("${member.displayName}", member.displayName)
          .replace("${breason}", reason)
      );
      let e = new Discord.MessageEmbed()
        .setColor("#228569")
        .setTitle("ModLogs Helixus")
        .setThumbnail(member.user.avatarURL())
        .setTimestamp()
        .addField(bot.lang.modlogs.type, bot.lang.modlogs.type_ban, true)
        .addField(bot.lang.modlogs.banned_user, member, true)
        .addField(bot.lang.modlogs.mod, message.author, true)
        .addField(bot.lang.modlogs.reason, reason, true);
      modlog.send(e);
    })
    .catch(err => {
      throw err;
    });
};
module.exports.help = {
  name: "ban",
  catégorie: "Modération",
  helpcaté: "mods"
};
