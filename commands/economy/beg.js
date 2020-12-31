const Command = require("../../structures/Command");
const ms = require('parse-ms');
const { randomInt } = require('../../structures/Utils')

module.exports = class BegCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'beg',
            description: "Begging for coins...",
            type: 'economy'
        });
    }

    async run(message) {
        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {

            let timeout = 900000;
            let amount = randomInt(5, 15)

            if (rows[0] && (rows[0].begCooldown !== null && timeout - (Date.now() - rows[0].begCooldown) > 0)) {
                
                let time = ms(timeout - (Date.now() - rows[0].begCooldown));
                return message.reply(message.guild.lang.COMMANDS.BEG.notReady(time))
            } else {
                if (!rows[0]) this.bot.db.query(`INSERT INTO Economy (userID, balance, begCooldown) VALUES ('${message.author.id}', '${amount}', '${Date.now()}')`)
                else this.bot.db.query(`UPDATE Economy SET balance = '${rows[0].balance + amount}', begCooldown = '${Date.now()}' WHERE userID='${message.author.id}'`);

                return message.reply(message.guild.lang.COMMANDS.BEG.success(amount));
            }
        })
    }
}