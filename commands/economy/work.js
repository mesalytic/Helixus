const ms = require('parse-ms');

const Command = require("../../structures/Command");
const { jobs } = require("../../structures/Constants");

module.exports = class WorkCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'work',
            description: "Work to gain money.",
            type: 'economy'
        });
    }

    async run(message) {
        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {
            if (err) throw err;

            let timeout = 43200000;
            let money = Math.floor(Math.random() * 500) + 1;

            if (rows[0] && (rows[0].workCooldown !== null && timeout - (Date.now() - rows[0].workCooldown) > 0)) {

                let time = ms(timeout - (Date.now() - rows[0].workCooldown));
                return message.reply(message.guild.lang.COMMANDS.WORK.cooldown(time))
            } else {
                let job = jobs[message.guild.lang.code][Math.floor(Math.random() * jobs[message.guild.lang.code].length)];

                if (!rows[0]) this.bot.db.query(`INSERT INTO Economy (userID, balance, workCooldown) VALUES ('${message.author.id}', '${money}', '${Date.now()}')`)
                else this.bot.db.query(`UPDATE Economy SET balance='${Number(rows[0].balance) + money}', workCooldown='${Date.now()}' WHERE userID='${message.author.id}'`)
                message.channel.send(message.guild.lang.COMMANDS.WORK.worked(job, money));
            }
        })
    }
}