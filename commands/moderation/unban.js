const { ReactionCollector } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class UnbanCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'unban',
            usage: 'unban <userID> [reason]',
            description: 'Unbans the specified user.',
            type: 'moderation',
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"]
        });
    }

    async run(message, args) {
        let memberID = args[0];

        if (!memberID) return this.bot.commands.get("help").run(message, ["unban"]);
        else {
            if (isNaN(memberID)) return message.reply(message.guild.lang.COMMANDS.UNBAN.notValidID);

            let reason = args.slice(1).join(" ");
            if (!reason) reason = message.guild.lang.COMMANDS.UNBAN.noReason;

            message.guild.members.unban(memberID, reason);
            console.log(reason);
            message.channel.send(message.guild.lang.COMMANDS.UNBAN.unbanned(memberID))
        }
    }
}