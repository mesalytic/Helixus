module.exports.run = async (bot, message, args, con) => {
  const chooseoption = args
    .slice(0)
    .join(" ")
    .split(" | ");
  if (chooseoption < 1)
    return message.channel.send(bot.lang.fun.choose.nooptions);
  const str = bot.lang.fun.choose.result.replace(
    "${chooseoption[Math.floor(Math.random() * chooseoption.length)]}",
    chooseoption[Math.floor(Math.random() * chooseoption.length)],
  );
  message.channel.send(str);
};
module.exports.help = {
  name: "choose",
  catégorie: "Fun",
  helpcaté: "fun",
};
