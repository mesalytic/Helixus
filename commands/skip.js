module.exports.run = async (bot, message, args, con) => {
  const queue = bot.queue;
  const serverQueue = queue.get(message.guild.id);
  const map = bot.skipVotes;
  const mapload = map.get(message.guild.id);

  if (!message.member.voice.channel)
    return message.channel.send(bot.lang.musique.skip.nochannel);
  if (!serverQueue) return message.channel.send(bot.lang.musique.skip.nomusic);

  if (message.member.voice.channel.members.size === 3) {
    message.channel.send(bot.lang.musique.skip.skipped);
    return await serverQueue.connection.dispatcher.end();
  }

  if (mapload.users.includes(message.author.id))
    return message.channel.send(bot.lang.musique.skip.alrvoted);

  mapload.users.push(message.author.id);
  await map.set(message.guild.id, mapload);

  if (mapload.users.length === 1) {
    const newvstr = bot.lang.musique.skip.vote
      .replace("${message.author}", message.author)
      .replace(
        "${message.guild.me.voiceChannel.members.size / 2}",
        parseInt(message.guild.me.voice.channel.members.size / 2, 10)
      );
    message.channel.send(newvstr);
  }
  if (mapload.users.length > 1) {
    const vstr = bot.lang.musique.skip.voted
      .replace("${message.author}", message.author)
      .replace(
        "${message.guild.me.voiceChannel.members.size / 2}",
        parseInt(message.guild.me.voice.channel.members.size / 2, 10)
      )
      .replace("${mapload.users.length}", mapload.users.length);
    message.channel.send(vstr);
  }
  const number = parseInt(message.guild.me.voice.channel.members.size / 2, 10);
  if (mapload.users.length !== number) return;
  message.channel.send(bot.lang.musique.skip.skipped);
  await serverQueue.connection.dispatcher.end();
};
module.exports.help = {
  name: "skip",
  catégorie: "Musique",
  helpcaté: "musique"
};
