module.exports.run = async (bot, message, args, con) => {
  const ment = message.mentions.users.first();
  if (!args[0]) return message.channel.send(bot.lang.fun.reverse.noargs);

  let sreverse;
  sreverse = reverseString(args.join(" "));

  if (ment) {
    sreverse = reverseString(ment.username);
  }
  if (args[0] === sreverse) {
    sreverse = `${args.join(" ")}${bot.lang.fun.reverse.broken}`;
  }
  message.channel.send(sreverse);
};
module.exports.help = {
  name: "reverse",
  catégorie: "Fun",
  helpcaté: "fun",
};
function reverseString(str) {
  return str.split("").reverse().join("");
}
