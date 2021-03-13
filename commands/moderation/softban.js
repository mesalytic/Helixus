const { ReactionCollector } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class SoftBanCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'softban',
            usage: 'softban <@user / userID> [reason]',
            description: 'Softbans the specified user. (banning then immediately unbanning a user)\nThis wipes all of their messages from the server. (up to 7 days)',
            type: 'moderation',
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"]
        });
    }

    async run(message, args) {
        let member = message.mentions.members.first();

        if (!member) {
            let userID = args[0];
            if (isNaN(userID)) return message.reply(message.guild.lang.COMMANDS.SOFTBAN.noMention);

            let reason = args.slice(1).join(" ");
            if (!reason) reason = message.guild.lang.COMMANDS.SOFTBAN.noReason;
            let m = await message.channel.send(message.guild.lang.COMMANDS.SOFTBAN.confirmationID(userID, reason));
            
            m.react("✅").then(() => {
                m.react("❌").then(() => {
                    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    const reactionCollector = new ReactionCollector(m, filter, {
                        time: 60000
                    })

                    reactionCollector.on('collect', reaction => {
                        switch(reaction.emoji.name) {
                            case '✅':
                                m.edit(message.guild.lang.COMMANDS.SOFTBAN.confirmedID(userID))
                                message.guild.members.ban(userID, { reason: reason, days: 7 });
                                message.guild.members.unban(userID);
                            case '❌':
                                reactionCollector.stop("cancelled");
                        }
                    })

                    reactionCollector.on('end', (collected, reason) => {
                        if (!collected.first() || (collected.first().emoji.name === "❌" && reason === "cancelled")) m.edit(message.guild.lang.COMMANDS.SOFTBAN.cancelled);
                    })
                })
            })
        }
        else {
            if (member === message.member || !member.bannable) return message.reply(message.guild.lang.COMMANDS.SOFTBAN.noValidMention);
            let reason = args.slice(1).join(" ");
            if (!reason) reason = message.guild.lang.COMMANDS.SOFTBAN.noReason;
            let m = await message.channel.send(message.guild.lang.COMMANDS.SOFTBAN.confirmation(member, reason));
            
            m.react("✅").then(() => {
                m.react("❌").then(() => {
                    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    const reactionCollector = new ReactionCollector(m, filter, {
                        time: 60000
                    })

                    reactionCollector.on('collect', reaction => {
                        switch(reaction.emoji.name) {
                            case '✅':
                                m.edit(message.guild.lang.COMMANDS.SOFTBAN.confirmed(member))
                                member.send(message.guild.lang.COMMANDS.SOFTBAN.pmConfirmed(message.guild.name, reason));
                                member.ban({ reason: reason, days: 7 });
                                message.guild.members.unban(member.id);
                            case '❌':
                                reactionCollector.stop("cancelled");
                        }
                    })

                    reactionCollector.on('end', (collected, reason) => {
                        if (!collected.first() || (collected.first().emoji.name === "❌" && reason === "cancelled")) m.edit(message.guild.lang.COMMANDS.SOFTBAN.cancelled);
                    })
                })
            })
        }
    }
}