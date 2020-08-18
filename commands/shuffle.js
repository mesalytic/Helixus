module.exports.run = async (bot, message, args, con) => {
  const shuffle = a => a.reduce((l, e, i) => {
    const j = Math.floor(Math.random() * (a.length - i) + i);
    [a[i], a[j]] = [a[j], a[i]];
    return a;
  }, a);

  const fixedShuffle = (a, f) => {
    const fixed = a.reduce((acc, e, i) => {
      if (f[i]) acc.push([e, i]);
      return acc;
    }, []);
    a = shuffle(a);

    fixed.forEach(([item, iIndex]) => {
      const currentIndex = a.indexOf(item);
      [a[iIndex], a[currentIndex]] = [a[currentIndex], a[iIndex]];
    });
    return a;
  };

  const { queue } = bot;
  const serverQueue = queue.get(message.guild.id);

  if (!message.member.voice.channel) return message.reply("You're not in a voice channel !");
  if (!serverQueue || !serverQueue.songs.length) return message.reply(bot.lang.musique.shuffle.nomusic);

  serverQueue.songs = fixedShuffle(serverQueue.songs, [true]);

  message.channel.send("Shuffled !");
};
module.exports.help = {
  name: "shuffle",
  catégorie: "Musique",
  helpcaté: "musique",
};
