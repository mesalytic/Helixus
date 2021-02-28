const { ReactionCollector } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class BanCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'ban',
            usage: 'ban <@user> [reason]',
            description: 'Bans the specified user.',
            type: 'moderation',
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"]
        });
    }

    async run(message, args) {
        let member = message.mentions.members.first();

        if (!member) return message.reply(message.guild.lang.COMMANDS.BAN.noMention);
        else {
            if (member === message.member || !member.bannable) return message.reply(message.guild.lang.COMMANDS.BAN.noValidMention);
            let reason = args.slice(1).join(" ");
            if (!reason) reason = message.guild.lang.COMMANDS.BAN.noReason;
            let m = await message.channel.send(message.guild.lang.COMMANDS.BAN.confirmation(member, reason));
            
            m.react("✅").then(() => {
                m.react("❌").then(() => {
                    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    const reactionCollector = new ReactionCollector(m, filter, {
                        time: 60000
                    })

                    reactionCollector.on('collect', reaction => {
                        switch(reaction.emoji.name) {
                            case '✅':
                                m.edit(message.guild.lang.COMMANDS.BAN.confirmed(member))
                                member.send(message.guild.lang.COMMANDS.BAN.pmConfirmed(message.guild.name, reason));
                                member.ban({ reason: reason });
                            case '❌':
                                reactionCollector.stop("cancelled");
                        }
                    })

                    reactionCollector.on('end', (collected, reason) => {
                        if (!collected.first() || (collected.first().emoji.name === "❌" && reason === "cancelled")) m.edit(message.guild.lang.COMMANDS.BAN.cancelled);
                    })
                })
            })
        }
    }
}