module.exports.run = async (bot, message, args, con) => {
  const queue = bot.queue;
  const serverQueue = queue.get(message.guild.id);
  if (serverQueue && serverQueue.playing) {
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    return message.channel.send(bot.lang.musique.pause.paused);
  }
  return message.channel.send(bot.lang.musique.pause.nomusic);
};
module.exports.help = {
  name: "pause",
  catégorie: "Musique",
  helpcaté: "musique"
};
