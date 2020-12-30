const Command = require("../../structures/Command");

module.exports = class LangCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'lang',
      usage: 'lang <fr/en>',
      description: 'Changes the bot\'s language on the server.',
      type: 'administration',
      userPermissions: ["MANAGE_GUILD"]
    });
  }

  async run(message, args) {
    if (!args[0]) return this.bot.commands.get("help").run(message, ["lang"]);

    if (["en", "fr"].includes(args[0].toLowerCase())) {
      this.bot.db.query(`SELECT * FROM Langs WHERE guildID='${message.guild.id}'`, (err, rows) => {
        if (!rows[0]) {
          this.bot.db.query(`INSERT INTO Langs (guildID, lang) VALUES ('${message.guild.id}', '${args[0].toLowerCase()}')`);
        } else {
          this.bot.db.query(`UPDATE Langs SET lang = '${args[0].toLowerCase()}' WHERE guildID='${message.guild.id}'`);
        }
        message.guild.lang = require(`../../structures/Languages/${args[0].toLowerCase()}.js`);
        message.channel.send(message.guild.lang.COMMANDS.LANG.success);
      });
    } else {
      return this.bot.commands.get("help").run(message, ["lang"]);
    }
  }
}