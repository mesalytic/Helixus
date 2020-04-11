module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  let gameA = args.slice(0).join(" ");
  var game;
  if (!gameA) return message.reply(bot.lang.images.steamplaying.nogame);
  else if (gameA.length > 20)
    return message.reply(bot.lang.images.steamplaying.toolong);
  else game = gameA;

  const m = await message.channel.send("Please wait...");

  get(
    `api.aliceraina.moe/v1/steamplaying?user=${encodeURIComponent(
      message.author.username
    )}&game=${game}&url=${message.author.avatarURL()}&`,
    {
      headers: { Authorization: bot.config.helixusapi },
      responseType: "arraybuffer"
    }
  )
    .then(res => {
      return message.channel
        .send("Generated with HelixusAPI (docs.helixus.fr)", {
          files: [{ attachment: res.data, name: "steamplaying.png" }]
        })
        .then(() => m.delete());
    })
    .catch(err => message.reply(err.message));
};
module.exports.help = {
  name: "steamplaying",
  catégorie: "Images",
  helpcaté: "images"
};
