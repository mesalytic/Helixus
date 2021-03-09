const Command = require("../../structures/Command");

module.exports = class PurgeCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'purge',
            usage: 'purge <number>',
            description: 'Removes the specified amount of messages.',
            notes: "`number` is limited to 100 messages, due to API limitations. To delete more than 100 messages, you'll need to run the command multiple times.",
            type: 'moderation',
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    }

    async run(message, args) {
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) return message.reply(message.guild.lang.COMMANDS.PURGE.noValidNumber)

        if (message.deletable) message.delete()

        setTimeout(async () => {
            let amount;
            if (parseInt(args[0]) > 100) amount = 100;
            else amount = parseInt(args[0]);

            let messages = await message.channel.bulkDelete(amount)
            message.channel.send(message.guild.lang.COMMANDS.PURGE.purged(messages.size));
        }, 1500)
    }
}