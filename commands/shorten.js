const shorten = require("isgd");
module.exports.run = async (bot, message, args, con) => {
  if (!args[0]) return message.channel.send(bot.lang.membres.shorten.noargs0);
  if (!args[1]) {
    shorten.shorten(args[0], function(res) {
      if (res.startsWith("Error:"))
        return message.channel.send(bot.lang.membres.shorten.errnoargs1);
      const str = bot.lang.membres.shorten.resp.replace("${res}", res);
      message.channel.send(str);
    });
  } else {
    shorten.custom(args[0], args[1], function(res) {
      if (res.startsWith("Error:")) {
        const str = bot.lang.membres.shorten.errargs1.replace("${res}", res);
        return message.channel.send(str);
      }
      const str = bot.lang.membres.shorten.resp.replace("${res}", res);
      message.channel.send(str);
    });
  }
};
module.exports.help = {
  name: "shorten",
  aliases: ["short"],
  catégorie: "Membres",
  helpcaté: "membres",
};
