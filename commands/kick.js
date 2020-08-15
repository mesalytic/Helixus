module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  let modlog;

  con.query(
    `SELECT * FROM ModlogsChannel WHERE guildID='${message.guild.id}'`,
    (err, rows) => {
      if (!rows[0]) {
        message.channel.send(bot.lang.mods.kick.channotdefined);
        modlog = message.channel;
      } else { modlog = message.guild.channels.resolve(rows[0].channelID); }
    },
  );
  if (!message.channel.permissionsFor(message.author).has("KICK_MEMBERS")) return message.channel.send(bot.lang.mods.kick.unotperm);
  if (!message.channel.permissionsFor(bot.user).has("KICK_MEMBERS")) return message.channel.send(bot.lang.mods.kick.bnotperm);

  if (message.mentions.users.size === 0) return message.channel.send(bot.lang.mods.kick.noment);

  var member = message.mentions.members.first();
  if (member.permissions.has("KICK_MEMBERS")) return message.reply(bot.lang.mods.kick.notposs);

  let reason = args.slice(1).join(" ");
  if (!reason) reason = bot.lang.mods.kick.noreason;

  message.reply(`You have been **kicked** from __**${message.guild.name}**__.\nReason: **${reason}**`).then(() => {
    member
    .kick(reason)
    .then(member => {
      message.channel.bulkDelete(1);
      message.channel.send(
        bot.lang.mods.kick.kick
          .replace("${member.displayName}", member.displayName)
          .replace("${breason}", reason),
      );
      let e = new Discord.MessageEmbed()
        .setColor("#DE2F42")
        .setTitle("ModLogs Helixus")
        .setThumbnail(member.user.avatarURL())
        .setTimestamp()
        .addField(bot.lang.modlogs.type, bot.lang.modlogs.type_kick, true)
        .addField(bot.lang.modlogs.kicked_user, member, true)
        .addField(bot.lang.modlogs.mod, message.author, true)
        .addField(bot.lang.modlogs.reason, reason, true);
      modlog.send(e);
    })
  })

  
};
module.exports.help = {
  name: "kick",
  catégorie: "Modération",
  helpcaté: "mods",
};
