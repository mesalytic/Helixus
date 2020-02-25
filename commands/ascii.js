module.exports.run = async (bot, message, args, con) => {
  var figlet = require("figlet");
  var maxLen = 15;
  if (args.join(" ").length > maxLen) {
    var diff = args.join(" ").length - maxLen;
    var str = bot.lang.membres.ascii.toolong.replace("${diff}", diff);
    return message.channel.send(str);
  }
  if (!args[0]) {
    return message.channel.send(bot.lang.membres.ascii.noargs);
  }
  figlet(`${args.join(" ")}`, function(err, data) {
    if (err) {
      throw err;
    }
    message.channel.send(`${data}`, {
      code: "AsciiArt"
    });
  });
};
module.exports.help = {
  name: "ascii",
  catégorie: "Membres",
  helpcaté: "membres"
};
