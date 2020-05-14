module.exports.run = async (bot, message, args, con) => {
  if (!message.channel.permissionsFor(message.author).has("BAN_MEMBERS")) {
    return message.channel.send(bot.lang.mods.unban.unotperm);
  } else if (!message.channel.permissionsFor(bot.user).has("BAN_MEMBERS")) {
    return message.channel.send(bot.lang.mods.unban.bnotperm);
  }
  let reason;
  reason = args.slice(1).join(" ");
  let user = args[0];

  if (reason.length < 1) reason = bot.lang.mods.unban.noreason;
  if (!user) return message.reply(bot.lang.mods.unban.noid);

  message.guild.members.unban(user, reason).catch(error => {
    throw error;
  });
  let str = bot.lang.mods.unban.unban
    .replace("${user}", user)
    .replace("${reason}", reason);
  message.channel.send(str);
};
module.exports.help = {
  name: "unban",
  catégorie: "Modération",
  helpcaté: "mods",
};
