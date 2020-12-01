const {
  Collection
} = require("discord.js");
const {
  permissions
} = require("../structures/Constants");
const cooldowns = new Collection();

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
        /* Owner Check */
        if (command.ownerOnly && message.author.id !== bot.config.ownerID) {
          return message.reply("This command is only accessible to bot owners!")
        }

        /* Permissions Check */
        let neededPermsBot = [];
        let neededPermsUser = [];

        command.userPermissions.forEach(uP => {
          if (!message.channel.permissionsFor(message.member).has(uP)) neededPermsUser.push(uP);
        })

        command.clientPermissions.forEach(uP => {
          if (!message.channel.permissionsFor(message.guild.me).has(uP)) neededPermsBot.push(uP);
        })

        if (neededPermsUser.length > 0) {
          return message.reply(`Missing USER Permissions: ${neededPermsUser.map((p) => `\`${permissions[`${p}`]}\``).join(", ")}`)
        }

        if (neededPermsBot.length > 0) {
          return message.reply(`Missing BOT Permissions: ${neededPermsBot.map((p) => `\`${permissions[`${p}`]}\``).join(", ")}`)
        }

        /* Cooldowns */
        if (!cooldowns.has(command.name)) {
          cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown;

        if (timestamps.has(message.author.id)) {
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} seconds before using this command.`)
          }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

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