module.exports.run = async (bot, message, args, con) => {
  const queue = bot.queue;
  const serverQueue = queue.get(message.guild.id);

  if (!message.member.voice.channel)
    return message.channel.send(bot.lang.musique.stop.nochannel);
  if (!serverQueue) return message.channel.send(bot.lang.musique.stop.nomusic);
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  return message.channel.send(bot.lang.musique.stop.stopped);
};
module.exports.help = {
  name: "stop",
  aliases: ["leave"],
  catégorie: "Musique",
  helpcaté: "musique"
};
