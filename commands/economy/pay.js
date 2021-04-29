const {
    ReactionCollector
} = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class PayCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'pay',
            description: "Give someone coins.",
            notes: 'For every coin transaction made, a 5% fee is deducted. You must consider those 5% when doing a transaction',
            usage: 'pay <@user> <amount>',
            type: 'economy'
        });
    }

    async run(message, args) {
        let user = message.mentions.users.filter(u => !u.bot).first();
        console.log(user);
        if (!user) return message.reply(message.guild.lang.COMMANDS.PAY.noUser);
        if (user.bot) return message.reply(message.guild.lang.COMMANDS.PAY.isBot)
        if (Math.round(Number(args[1]) - (Math.round(Number(args[1])) * 0.05)) <= 0) return message.reply(message.guild.lang.COMMANDS.PAY.noCoinsSpecified);
        if (user === message.author) return message.reply(message.guild.lang.COMMANDS.PAY.noUser);

        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, async (err, payerRows) => {
            this.bot.db.query(`SELECT * FROM Economy WHERE userID='${user.id}'`, async (err, payedRows) => {
                this.bot.db.query(`SELECT * FROM userPremiums WHERE premiumHolder='${message.author.id}'`, async (err, premiums) => {
                    if (!payerRows[0]) {
                        this.bot.db.query(`INSERT INTO Economy (userID, balance) VALUES ('${message.author.id}', '0')`);
                        return message.reply(message.guild.lang.COMMANDS.PAY.notEnoughCoins);
                    } else {
                        if (!args[1] || isNaN(args[1]) || args[1] <= 0) return message.reply(message.guild.lang.COMMANDS.PAY.noCoinsSpecified);
                        if (payerRows[0].balance < Math.round(Number(args[1]))) return message.reply(message.guild.lang.COMMANDS.PAY.notEnoughCoins);
    
                        let m = await message.channel.send(premiums[0] ? message.guild.lang.COMMANDS.PAY.pendingPremium(Math.round(Number(args[1])), user) : message.guild.lang.COMMANDS.PAY.pending(Math.round(Number(args[1])), Math.round(Number(args[1]) - (Math.round(Number(args[1])) * 0.05)), user))
                        m.react("✅").then(() => {
                            m.react("❌").then(() => {
                                const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
                                const reactionCollector = new ReactionCollector(m, filter, {
                                    time: 600000
                                })
    
                                reactionCollector.on('collect', async reaction => {
                                    switch (reaction.emoji.name) {
                                        case '✅': {
                                            if (!payedRows[0]) this.bot.db.query(`INSERT INTO Economy (userID, balance) VALUES ('${user.id}', '${premiums[0] ? Math.round(Number(args[1])) : Math.round(Number(args[1]) - (Math.round(Number(args[1])) * 0.05))}')`);
                                            else this.bot.db.query(`UPDATE Economy SET balance='${payedRows[0].balance + premiums[0] ? Math.round(Number(args[1])) : Math.round(Number(args[1]) - (Math.round(Number(args[1])) * 0.05))}' WHERE userID='${user.id}'`);
    
                                            this.bot.db.query(`UPDATE Economy SET balance='${payerRows[0].balance - Math.round(Number(args[1]))}' WHERE userID='${message.author.id}'`);
                                            reactionCollector.stop("pay_success");
                                        }
                                        case '❌':
                                            reactionCollector.stop("pay_denied");
                                    }
                                })
                                reactionCollector.on('end', (_, reason) => {
                                    switch (reason) {
                                        case "pay_success":
                                            m.edit(message.guild.lang.COMMANDS.PAY.success(premiums[0] ? Math.round(Number(args[1])) : Math.round(Number(args[1]) - (Math.round(Number(args[1])) * 0.05)), user))
                                            break;
                                        case "pay_denied":
                                            m.edit(message.guild.lang.COMMANDS.PAY.cancelled)
                                            break;
                                    }
                                })
                            })
                        })
                    }
                })
            })
        })
    }
}