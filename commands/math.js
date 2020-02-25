module.exports.run = async (bot, message, args, con) => {
  const math = require("mathjs");

  const input = args.join(" ");
  if (!input) {
    return message.reply(bot.lang.membres.math.noargs);
  }

  const question = args.join(" ");
  let answer;
  try {
    answer = math.evaluate(question);
  } catch (err) {
    return message.reply(err);
  }
  const str = bot.lang.membres.math.result
    .replace("${question}", question)
    .replace("${answer}", answer);
  message.channel.send(str);
};
module.exports.help = {
  name: "math",
  catégorie: "Membres",
  helpcaté: "membres"
};
