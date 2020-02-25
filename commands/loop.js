module.exports.run = async (bot, message, args, con) => {
  const queue = bot.queue;
  const serverQueue = queue.get(message.guild.id);
  if (!serverQueue) return message.channel.send(bot.lang.musique.loop.nomusic);
  if (serverQueue.loop === true) {
    serverQueue.loop = false;
    return message.channel.send(bot.lang.musique.loop.disabled);
  }
  serverQueue.loop = true;
  return message.channel.send(bot.lang.musique.loop.enabled);
};
module.exports.help = {
  name: "loop",
  catégorie: "Musique",
  helpcaté: "musique"
};
