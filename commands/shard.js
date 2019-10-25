module.exports.run = async (bot, message, args, con) => {
  message.channel.send(
    `${bot.lang.infos.shard.actual} : ${bot.shard.id + 1}**/${bot.shard.count}`
  );
};
module.exports.help = {
  name: "shard",
  catégorie: "Infos",
  helpcaté: "infos"
};
