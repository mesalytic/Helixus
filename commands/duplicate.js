module.exports.run = async (bot, message, args, con) => {
  const queue = bot.queue;
  const serverQueue = queue.get(message.guild.id);
  if (!message.member.voice.channel) return message.channel.send(bot.lang.musique.duplicate.nochannel);
  if (!serverQueue) return message.channel.send(bot.lang.musique.duplicate.nomusic);
  if (!args[0] || isNaN(args[0])) return message.reply(bot.lang.musique.duplicate.choose);
  if (args[0] < 1) return message.reply(bot.lang.musique.duplicate.nottoomuch);
  if (args[0] > 50) return message.reply(bot.lang.musique.duplicate.toomuch);
  for (let i = 0; i < Math.round(Number(args[0])); i++) {
    serverQueue.songs.unshift(serverQueue.songs[0]);
  }
  let str = bot.lang.musique.duplicate.duplicated;
  if (bot.lang.lang === "en") {
message.channel.send(
      str
        .replace("${Number(args[0])}", Math.round(Number(args[0])))
        .replace(
          "${Number(args[0]) === 1 ? 'time': 'times'}",
          Math.round(Number(args[0])) === 1 ? "time" : "times",
        ),
    );
} else if (lang === "fr") {
message.channel.send(
      str
        .replace("${Number(args[0])}", Math.round(Number(args[0])))
        .replace("${Number(args[0]) === 1 ? 'foi': 'fois'}", "fois"),
    );
}
};
module.exports.help = {
  name: "duplicate",
  catégorie: "Musique",
  helpcaté: "musique",
};
