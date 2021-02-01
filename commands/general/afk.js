const Command = require("../../structures/Command");

module.exports = class AfkCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'afk',
            type: 'general',
            description: 'Allows you to set an AFK message.',
            usage: 'afk <reason>',
            examples: ["afk Homework"],
        });
    }

    async run(message, args) {
        this.bot.db.query(`SELECT * FROM Afk WHERE userID='${message.author.id}'`, (err, rows) => {
            let reason = args.join(" ");
            if (!reason) return message.reply(message.guild.lang.COMMANDS.AFK.noReason);

            if (!rows[0]) this.bot.db.query(`INSERT INTO Afk (userID, reason) VALUES ('${message.author.id}', '${reason}')`)
            else this.bot.db.query(`UPDATE Afk SET reason='${reason}' WHERE userID='${message.author.id}'`)
            return message.channel.send(message.guild.lang.COMMANDS.AFK.success)
        })
    }
}