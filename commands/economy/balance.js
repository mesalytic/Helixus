const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class BalanceCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'balance',
            description: "Displays your current balance.",
            type: 'economy'
        });
    }

    async run(message, args) {
        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {
            let bal = 0;
            if (!rows[0]) this.bot.db.query(`INSERT INTO Economy (userID) VALUES ('${message.author.id}')`);
            else bal = rows[0].balance;

            message.reply(`You have <a:coin:784930553748520961> **${bal}** coins!`)
        })
    }
}