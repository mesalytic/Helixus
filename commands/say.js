module.exports.run = async (bot, message, args, con) => {
  const saymess = message.content
    .split(" ")
    .slice(1)
    .join(" ")
    .slice(" ");
  if (!saymess) return message.reply(bot.lang.admin.say.noargs);
  if (message.author === bot.user) return;
  if (message.channel.permissionsFor(message.author).has("ADMINISTRATOR")) {
    message.delete({ timeout: 30 });
    message.channel.send(saymess);
  }
};
module.exports.help = {
  name: "say",
  catégorie: "Administration",
  helpcaté: "admin"
};
