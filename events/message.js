let cmdCooldown = {};

module.exports = (bot, message) => {
  if (message.channel.type === 'dm' || !message.channel.viewable || message.author.bot) return;
  bot.db.query(`SELECT * FROM Prefixes WHERE guildID='${message.guild.id}'`, (err, prefixes) => {
    let prefix;
    if (err) bot.logger.error(err);

    if (!prefixes[0]) prefix = "am!"
    else prefix = prefixes[0].prefix;

    const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|am\!|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);

    if (prefixRegex.test(message.content)) {
      const [, match] = message.content.match(prefixRegex);
      const args = message.content.slice(match.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      let command = bot.commands.get(cmd) || bot.aliases.get(cmd);

      if (command) {

        if (command.ownerOnly && message.author.id !== bot.config.ownerID) {
          return message.reply("This command is only accessible to bot owners!")
        }

        /*let uCooldown = JSON.parse(cmdCooldown[message.author.id]);
        console.log(`uCooldown = ${uCooldown}`)
        if (!uCooldown) {
          cmdCooldown[message.author.id] = {};
          uCooldown = JSON.parse(cmdCooldown[message.author.id]);
        }
        let time = uCooldown[command.name] | 0;
        if (time && (time > Date.now())) {
          return message.reply(`Hey! Please wait ${Math.ceil((time-Date.now())/1000)} seconds before performing this command!`)
        }
        console.log(command.cooldown);
        cmdCooldown[message.author.id][command.name] = Date.now() + command.cooldown;
*/
        try {
          command.run(message, args);
        } catch (e) {
          bot.logger.error(e);
          return message.reply(`An error has occured.`)
        }
      }
    }
  })
}