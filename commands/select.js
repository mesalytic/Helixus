module.exports.run = async (bot, message, args, con) => {
  const randommember = message.guild.members.cache.random(1)[0].user.username;
  if (!args[0]) {
    const str = bot.lang.fun.select.noargs.replace(
      "${randommember}",
      randommember,
    );
    message.channel.send(str);
  } else {
    const randomtexte = args.join(" ");
    const str = bot.lang.fun.select.withsubject
      .replace("${randomtexte}", randomtexte)
      .replace("${randommember}", randommember);
    message.channel.send(str);
  }
};
module.exports.help = {
  name: "select",
  catégorie: "Fun",
  helpcaté: "fun",
};
