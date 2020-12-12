const Command = require("../../structures/Command");

module.exports = class ToggleCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'toggle',
            description: 'Toggles on or off the levelling system in your server.',
            type: 'levels',
            usage: 'toggle <on/off>',
            examples: ["toggle off", "toggle on"],
            userPermissions: ["MANAGE_GUILD"]
        });
    }

    async run(message, args) {
        this.bot.db.query(`SELECT * FROM LevelsConfig WHERE guildID='${message.guild.id}'`, (err, rows) => {
            if (args[0] === "off") {
                if (!rows[0] || rows[0].activated === "false") return message.reply('[❌] - The levelling system is already **disabled**!');
                this.bot.db.query(`UPDATE LevelsConfig SET activated = "false" WHERE guildID='${message.guild.id}'`);
                message.channel.send('[✅] - The levelling system has successfully been **disabled** !');
            } 
            else if (args[0] === "on") {
                if (!rows[0]) {
                    this.bot.db.query(`INSERT INTO LevelsConfig (activated, guildID, lvlupChannelID) VALUES ('true', '${message.guild.id}', 'msgChannel')`);
                    message.channel.send('[✅] - The levelling system has successfully been **enabled** !');
                  } else if (rows[0].activated === "false") {
                    this.bot.db.query(`UPDATE LevelsConfig SET activated = "true" WHERE guildID='${message.guild.id}'`);
                    message.channel.send('[✅] - The levelling system has successfully been **enabled** !');
                  } else { 
                      return message.reply('[❌] - The levelling system is already **enabled**!');
                  }
            }
        })
    }
}