const { ReactionCollector } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class KickCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'kick',
            usage: 'kick <@user> [reason]',
            description: 'Kicks the specified user.',
            type: 'moderation',
            userPermissions: ["KICK_MEMBERS"],
            clientPermissions: ["KICK_MEMBERS"]
        });
    }

    async run(message, args) {
        let member = message.mentions.members.first();

        if (!member) return message.reply(message.guild.lang.COMMANDS.KICK.noMention);
        else {
            if (member === message.member || !member.bannable) return message.reply(message.guild.lang.COMMANDS.KICK.noValidMention);
            let reason = args.slice(1).join(" ");
            if (!reason) reason = message.guild.lang.COMMANDS.KICK.noReason;
            let m = await message.channel.send(message.guild.lang.COMMANDS.KICK.confirmation(member, reason));
            
            m.react("✅").then(() => {
                m.react("❌").then(() => {
                    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    const reactionCollector = new ReactionCollector(m, filter, {
                        time: 60000
                    })

                    reactionCollector.on('collect', reaction => {
                        switch(reaction.emoji.name) {
                            case '✅':
                                m.edit(message.guild.lang.COMMANDS.KICK.confirmed(member))
                                member.send(message.guild.lang.COMMANDS.KICK.pmConfirmed(message.guild.name, reason));
                                member.kick({ reason: reason });
                            case '❌':
                                reactionCollector.stop("cancelled");
                        }
                    })

                    reactionCollector.on('end', (collected, reason) => {
                        if (!collected.first() || (collected.first().emoji.name === "❌" && reason === "cancelled")) m.edit(message.guild.lang.COMMANDS.KICK.cancelled);
                    })
                })
            })
        }
    }
}