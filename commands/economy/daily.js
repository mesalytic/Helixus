const ms = require('parse-ms');
const Command = require("../../structures/Command");

module.exports = class DailyCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'daily',
            description: "Gives you coins daily!",
            aliases: ["day"],
            type: 'economy'
        });
    }

    async run(message) {
        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {
            this.bot.db.query(`SELECT * FROM userPremiums WHERE premiumHolder='${message.author.id}'`, (err, premiums) => {
                let timeout = 86400000;
                let amount = premiums[0] ? 400 : 200;
    
                if (rows[0] && (rows[0].dailyCooldown !== null && timeout - (Date.now() - rows[0].dailyCooldown) > 0)) {
                    
                    let time = ms(timeout - (Date.now() - rows[0].dailyCooldown));
                    return message.reply(message.guild.lang.COMMANDS.DAILY.notReady(time))
                } else {
                    if (!rows[0]) this.bot.db.query(`INSERT INTO Economy (userID, balance, dailyCooldown) VALUES ('${message.author.id}', '${amount}', '${Date.now()}')`)
                    else this.bot.db.query(`UPDATE Economy SET balance = '${rows[0].balance + amount}', dailyCooldown = '${Date.now()}' WHERE userID='${message.author.id}'`);
    
                    return message.reply(`${message.guild.lang.COMMANDS.DAILY.success(amount)} ${premiums[0] ? "*x2 coins (Premium)*" : ""}`);
                }
            })
        })
    }
}