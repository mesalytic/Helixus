module.exports = (bot, message) => {
    if (message.channel.type === 'dm' || !message.channel.viewable || message.author.bot) return;

    //const prefix = bot.db.settings.selectPrefix.pluck().get(message.guild.id);
    const prefix = "am!";
  const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);

  if (prefixRegex.test(message.content)) {
    const [, match] = message.content.match(prefixRegex);
    const args = message.content.slice(match.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = bot.commands.get(cmd) || bot.aliases.get(cmd);

    if (command) {
        return command.run(message, args);
    }
  }
}