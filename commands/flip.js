module.exports.run = async (bot, message, args, con) => {
  const sleep = require("system-sleep");

  var flips = [bot.lang.fun.flip.heads, bot.lang.fun.flip.tails];
  var res = flips[Math.floor(Math.random() * flips.length)];

  message.channel.send(bot.lang.fun.flip.launched).then(m => {
    setTimeout(() => {
      m.edit(`${bot.lang.fun.flip.result} ${res} !`);
    }, 2000);
  });
};
module.exports.help = {
  name: "flip",
  catégorie: "Fun",
  helpcaté: "fun",
};