module.exports.run = async (bot, message, args, con) => {
  try {
    const computer = rand(0, 5);
    let devaran;

    switch (computer) {
      case 0:
        devaran = ":one:";
        break;
      case 1:
        devaran = ":two:";
        break;
      case 2:
        devaran = ":three:";
        break;
      case 3:
        devaran = ":four:";
        break;
      case 4:
        devaran = ":five:";
        break;
      case 5:
        devaran = ":six:";
        break;
    }
    return message.channel.send(bot.lang.fun.dice.result + devaran);

  } catch (e) {
    throw e;
  }
};
module.exports.help = {
  name: "dice",
  aliases: ["rolll"],
  catégorie: "Fun",
  helpcaté: "fun",
};
function rand(low, high) {
  return (Math.random() * (high + 1 - low) + low) | 0;
}
