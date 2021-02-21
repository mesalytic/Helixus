const Command = require("../../structures/Command");
const ms = require('ms');
const { Util } = require("discord.js");

module.exports = class RemindMeCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'remindme',
            type: 'general',
            description: 'Reminds you at a specified date for a specified reason.',
            usage: 'remindme <message> <time>\nam!remindme list',
            examples: ["remindme Eat 3h"],
        });
    }

    /**
     * TODO
     * * list arg
     * * remove arg
     * * reaction based for remove arg
     */

    async run(message, args) {
        if (args[0] === "list") {
            // soon (3.1)
        }
        if (args[0] === "remove") {
            // soon (3.1)
        }
        this.bot.db.query(`SELECT * FROM Reminders WHERE userID='${message.author.id}'`, (err, rows) => {
            let time = args.pop();
            let reason = args.join(" ");

            if (ms(time) === undefined) return message.reply(message.guild.lang.COMMANDS.REMINDME.invalidTime);

            let timestamp = Number(Date.now()) + Number(isNaN(time) ? ms(time) : time);

            this.bot.db.query(`INSERT INTO Reminders (userID, reason, timestamp) VALUES ('${message.author.id}', '${reason}', '${timestamp}')`)
            message.reply(message.guild.lang.COMMANDS.REMINDME.success(Util.escapeMarkdown(reason), isNaN(time) ? ms(ms(time), { long: true }) : ms(Number(time), { long: true })))

            setTimeout(() => {
                message.author.send(message.guild.lang.COMMANDS.REMINDME.reminded(reason))
                this.bot.db.query(`DELETE FROM Reminders WHERE reason='${reason}' AND userID='${message.author.id}'`)
            }, isNaN(time) ? ms(time) : time)
        })
    }
}