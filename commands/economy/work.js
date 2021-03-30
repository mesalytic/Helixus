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
        let money = Math.floor(Math.random() * 500) + 1;
        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {
            if (err) throw err;
            let job = jobs[message.guild.lang.code][Math.floor(Math.random() * jobs[message.guild.lang.code].length)];

            if (!rows[0]) this.bot.db.query(`INSERT INTO Economy (userID, balance) VALUES ('${message.author.id}', '${money}')`)
            else this.bot.db.query(`UPDATE Economy SET balance='${Number(rows[0].balance) + money}' WHERE userID='${message.author.id}'`)
            message.channel.send(message.guild.lang.COMMANDS.WORK.worked(job, money));
        })
    }
}