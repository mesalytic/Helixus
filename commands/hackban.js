module.exports.run = async (bot, message, args, con) => {
  let mid = args[0];
  let reason = args.slice (1).join (' ');

  if (!mid) return message.channel.send (bot.lang.mods.hackban.noid);
  if (reason.length < 1) reason = bot.lang.mods.hackban.noreason;

  if (mid === message.author.id)
    return message.reply (bot.lang.mods.hackban.nobanyou);
  if (mid === bot.user.id) return message.reply (bot.lang.mods.hackban.nobanme);

  if (!message.member.permissions.has ('BAN_MEMBERS'))
    return message.channel.send (bot.lang.mods.hackban.noperms);

  bot.users
    .fetch (mid)
    .then (user => {
      message.guild.members.ban (user, reason, 7).catch (err => {
        let str = bot.lang.mods.hackban.catch1.replace ('${id}', id);
        message.channel.send (str);
        throw err;
      });

      let str = bot.lang.mods.hackban.ban
        .replace ('${id.username}', user.username)
        .replace ('${id.discriminator}', user.discriminator)
        .replace ('${mid}', mid);
      message.channel.send (str);
    })
    .catch (() => {
      let str = bot.lang.mods.hackban.catch2.replace ('${mid}', mid);
      message.channel.send (str);
    });
};
module.exports.help = {
  name: 'hackban',
  catégorie: 'Modération',
  helpcaté: 'mods',
};
