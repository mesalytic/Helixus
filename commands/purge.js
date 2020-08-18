module.exports.run = async (bot, message, args, con) => {
  if (!message.channel.permissionsFor(message.author).has("MANAGE_MESSAGES")) {
    return message.channel.send(bot.lang.mods.purge.unotperm);
  } else if (!message.channel.permissionsFor(bot.user).has("MANAGE_MESSAGES")) {
    return message.channel.send(bot.lang.mods.purge.bnotperm);
  }

  // Let deleteCount;
  async function bulkDelete() {
    let deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 2) return message.reply(bot.lang.mods.purge.noargs);
    for (let i = 0; i <= Math.floor(deleteCount / 100); i++) {
      if (deleteCount - i * 100 < 100) {
        await message.channel.bulkDelete((deleteCount % 100) + 1);
      } else {
        await message.channel.bulkDelete(100);
      }
    }
    let str = bot.lang.mods.purge.purged.replace("${deleteCount}", deleteCount);
    message.channel.send(str).then(m => {
      setTimeout(() => {
        m.delete();
      }, 3000);
    });
  }
  bulkDelete();
};
module.exports.help = {
  name: "purge",
  aliases: ["clear"],
  catégorie: "Modération",
  helpcaté: "mods",
};
