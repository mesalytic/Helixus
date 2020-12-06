const {
    MessageEmbed
} = require("discord.js");
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

    async run(message, args) {
        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {

            let timeout = 86400000;
            let amount = 200;

            if (rows[0] && (rows[0].dailyCooldown !== null && timeout - (Date.now() - rows[0].dailyCooldown) > 0)) {
                
                let time = ms(timeout - (Date.now() - rows[0].dailyCooldown));
                return message.reply(`You already collected your daily bonus! Come back in ${time.hours}:${time.minutes}:${time.seconds} !`)
            } else {
                if (!rows[0]) this.bot.db.query(`INSERT INTO Economy (userID, balance, dailyCooldown) VALUES ('${message.author.id}', '${amount}', '${Date.now()}')`)
                else this.bot.db.query(`UPDATE Economy SET balance = '${rows[0].balance + amount}', dailyCooldown = '${Date.now()}' WHERE userID='${message.author.id}'`);

                return message.reply(`You've collected your daily reward of ${amount} coins!`)
            }
        })
    }
}