module.exports.run = async (bot, message, args, con) => {
  const queue = bot.queue;
  const fs = require("fs");
  const db = require("quick.db");

  const serverQueue = queue.get(message.guild.id);
  if (serverQueue && !serverQueue.playing) {
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    return message.channel.send(bot.lang.musique.resume.resumed);
  }
  return message.channel.send(bot.lang.musique.resume.nomusic);
};
module.exports.help = {
  name: "resume",
  catégorie: "Musique",
  helpcaté: "musique"
};
