module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");

  const queue = bot.queue;
  const serverQueue = queue.get(message.guild.id);
  if (!serverQueue) return message.channel.send(bot.lang.musique.np.nomusic);

  const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(bot.lang.musique.np.music)
    .setImage(serverQueue.songs[0].thumbnail)
    .setDescription(
      `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\n${
        bot.lang.musique.np.time
      } ${timeString(
        serverQueue.connection.dispatcher ?
          serverQueue.connection.dispatcher.streamTime / 1000 :
          0,
      )} / ${serverQueue.songs[0].duration_length} (${timeLeft(
        serverQueue.connection.dispatcher ?
          serverQueue.connection.dispatcher.streamTime / 1000 :
          0,
      )} ${bot.lang.musique.np.left})\n\n${bot.lang.musique.np.addedby} ${
        serverQueue.songs[0].requestedby
      }`,
    );

  function timeString(seconds, forceHours = false) {
    const hours = Math.floor(seconds / 3600),
      minutes = Math.floor((seconds % 3600) / 60);
    return `${forceHours || hours >= 1 ? `${hours}:` : ""}${
      hours >= 1 ? `0${minutes}`.slice(-2) : minutes
    }:${`0${Math.floor(seconds % 60)}`.slice(-2)}`;
  }

  function timeLeft(currentTime) {
    return timeString(serverQueue.songs[0].duration_unformated - currentTime);
  }
  message.channel.send(embed);
};
module.exports.help = {
  name: "np",
  catégorie: "Musique",
  helpcaté: "musique",
};
