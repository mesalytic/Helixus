module.exports.run = async (bot, message, args, con) => {
  if (!message.channel.permissionsFor(message.author).has("MANAGE_ROLES")) return message.channel.send(bot.lang.mods.unmute.unotperm);
  else if (!message.channel.permissionsFor(bot.user).has("MANAGE_ROLES")) return message.channel.send(bot.lang.mods.unmute.bnotperm);

  let member = message.mentions.members.first();
  if (!member) return message.channel.send(bot.lang.mods.unmute.noment);

  let muteRole = message.guild.roles.cache.find(u => u.name === "HMuted");
  if (!muteRole) return message.reply(bot.lang.mods.unmute.nobodymuted);
  if (!member.roles.has(muteRole.id)) return message.reply(bot.lang.mods.unmute.notmuted);

  let roleArr = [];

  con.query(`SELECT * FROM MuteRoles WHERE mutedID='${member.id}' AND guildID='${message.guild.id}'`, (err, rows) => {
    if (!rows[0]) return message.reply(bot.lang.mods.unmute.notmuted);

    rows.forEach(r => {
      roleArr.push(r.roleID);
    });

    member.roles.remove(muteRole).then(() => {
      member.roles.add(roleArr);
      let str = bot.lang.mods.unmute.unmute.replace("${member.user.tag}", member.user.tag).replace("${member.id}", member.id).replace("${message.author.tag}", message.author.tag).replace("${message.author.id}", message.author.id);
      message.channel.send(str);
    });
  });
};
module.exports.help = {
  name: "unmute",
  catégorie: "Modération",
  helpcaté: "mods",
};
