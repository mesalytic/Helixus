module.exports.run = async (bot, message, args, con) => {
  message.channel.send(`${bot.lang.infos.shard.actual} : ${bot.shard.ids[0] + 1}**/${bot.shard.count}`,);
};
module.exports.help = {
  name: "shard",
  catégorie: "Infos",
  helpcaté: "infos",
};
