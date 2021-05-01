const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command");
const moment = require('moment');



module.exports = class PremiumCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'premium',
            type: 'general',
            description: 'Check how much time left is on your premium, and how you can have it!',
            usage: 'premium [use]',
        });
    }

    async run(message, args) {
        moment.locale(message.guild.lang.code);
        this.bot.db.query(`SELECT * FROM userPremiums WHERE premiumHolder='${message.author.id}'`, (err, premiums) => {
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(message.guild.lang.COMMANDS.PREMIUM.status)
                .setDescription(`${premiums[0] && premiums[0].activated ? message.guild.lang.COMMANDS.PREMIUM.activated : message.guild.lang.COMMANDS.PREMIUM.disabled }${premiums[0] && premiums[0].activated ? `\n${message.guild.lang.COMMANDS.PREMIUM.until} **${moment(Number(premiums[0].endOfPremium)).format("DD MMMM Y")}**` : ""}\n${message.guild.lang.COMMANDS.PREMIUM.tokens(premiums[0] ? premiums[0].tokens : 0)}`)
                .addField(message.guild.lang.COMMANDS.PREMIUM.how, message.guild.lang.COMMANDS.PREMIUM.heresHow)

                message.channel.send(embed);
        })
    }
}