module.exports.run = async (bot, message, args, con) => {
  const queue = bot.queue;
  const serverQueue = queue.get(message.guild.id);

  if (!message.member.voice.channel)
    return message.channel.send(bot.lang.musique.volume.nochannel);
  if (!serverQueue)
    return message.channel.send(bot.lang.musique.volume.nomusic);
  const cvstr = bot.lang.musique.volume.currentvolume;
  const currentvolume = cvstr.replace(
    "${serverQueue.volume}",
    serverQueue.volume
  );
  if (!args[0] || isNaN(args[0])) return message.channel.send(currentvolume);
  if (args[0] > 100)
    return message.channel.send(bot.lang.musique.volume.toohigh);
  if (args[0] < 1) return message.channel.send(bot.lang.musique.volume.toolow);
  serverQueue.volume = args[0];
  serverQueue.connection.dispatcher.setVolume(args[0] / 120);
  const vsstr = bot.lang.musique.volume.volumeset;
  const volumeset = vsstr.replace("${volumeinput[1]}", args[0]);
  return message.channel.send(volumeset);
};
module.exports.help = {
  name: "volume",
  catégorie: "Musique",
  helpcaté: "musique"
};
