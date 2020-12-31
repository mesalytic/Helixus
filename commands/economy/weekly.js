const Command = require("../../structures/Command");
const ms = require('parse-ms');
const { randomInt } = require('../../structures/Utils')

module.exports = class WeeklyCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'weekly',
            description: "Gives you coins weekly!",
            type: 'economy'
        });
    }

    async run(message) {
        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {

            let timeout = 604800000;
            let amount = randomInt(550, 950)

            if (rows[0] && (rows[0].weeklyCooldown !== null && timeout - (Date.now() - rows[0].weeklyCooldown) > 0)) {
                
                let time = ms(timeout - (Date.now() - rows[0].weeklyCooldown));
                return message.reply(message.guild.lang.COMMANDS.WEEKLY.notReady(time))
            } else {
                if (!rows[0]) this.bot.db.query(`INSERT INTO Economy (userID, balance, weeklyCooldown) VALUES ('${message.author.id}', '${amount}', '${Date.now()}')`)
                else this.bot.db.query(`UPDATE Economy SET balance = '${rows[0].balance + amount}', weeklyCooldown = '${Date.now()}' WHERE userID='${message.author.id}'`);

                return message.reply(message.guild.lang.COMMANDS.WEEKLY.success(amount));
            }
        })
    }
}