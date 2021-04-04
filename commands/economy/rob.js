const ms = require('parse-ms');

const Command = require("../../structures/Command");
const { randomInt } = require("../../structures/Utils");

module.exports = class RobCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'rob',
            description: "Rob someone's coins!",
            type: 'economy',
            usage: 'rob @user'
        });
    }
    //TODO: 

    async run(message) {

        let member = message.mentions.members.first();
        if (!member) return message.reply(message.guild.lang.COMMANDS.ROB.noMention);

        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {
            if (err) throw err;

            this.bot.db.query(`SELECT * FROM Economy WHERE userID='${member.id}'`, (err, rRows) => {
                if (err) throw err;

                let timeout = 86400000;

                if (!rRows[0]) return message.reply(message.guild.lang.COMMANDS.ROB.robbedNotEnoughCoins)
                if (rRows[0] && rRows[0].balance <= 300) return message.reply(message.guild.lang.COMMANDS.ROB.robbedNotEnoughCoins)

                if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.ROB.robberNotEnoughCoins)
                if (rows[0] && rows[0].balance <= 300) return message.reply(message.guild.lang.COMMANDS.ROB.robberNotEnoughCoins)

                let robbed = randomInt(1, Math.round(rRows[0].balance / 30));

                if (rows[0] && (rows[0].robCooldown !== null && timeout - (Date.now() - rows[0].robCooldown) > 0)) {

                    let time = ms(timeout - (Date.now() - rows[0].robCooldown));
                    return message.reply(message.guild.lang.COMMANDS.ROB.cooldown(time))
                } else {
                    message.channel.send(message.guild.lang.COMMANDS.ROB.success(robbed, member.user.tag));

                    this.bot.db.query(`UPDATE Economy SET balance='${Number(rRows[0].balance) - robbed}' WHERE userID='${member.id}'`); // Remove from Robbed
                    this.bot.db.query(`UPDATE Economy SET balance='${Number(rows[0].balance) + robbed}', robCooldown='${Date.now()}' WHERE userID='${message.author.id}'`) // Add to robber
                }
            })
        })
    }
}