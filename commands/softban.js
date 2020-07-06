module.exports.run = async (bot, message, args, con) => {
  if (!message.channel.permissionsFor(message.author).has("BAN_MEMBERS")) return message.reply(bot.lang.mods.softban.unotperm);
  if (!message.mentions.users.first()) return message.channel.send(bot.lang.mods.softban.noment);

  let ment = message.mentions.members;
  let text = [];

  ment.forEach(m => {
    if (!m.bannable) {
      let str = bot.lang.mods.softban.err1.replace(
        "${m.username}",
        m.user.username,
      );
      return message.channel.send(str);
    } else {
      let id = m.id;
      m.ban({ days: 7, reason: `Helixus - Softban by ${message.author.tag}` })
        .then(() => {
          message.guild.members.unban(id).then(() => {
            let str = bot.lang.mods.softban.softban.replace(
              "${m.tag}",
              m.user.tag,
            );
            message.channel.send(str);
          });
        })
        .catch(err => {
          throw err;
        });
    }
  });
};
module.exports.help = {
  name: "softban",
  catégorie: "Modération",
  helpcaté: "mods",
};
