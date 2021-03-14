const ms = require('ms');
const Command = require("../../structures/Command");

module.exports = class SlowModeCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'slowmode',
            usage: 'slowmode <time>',
            description: 'Sets a rate limit per user in the channel.',
            type: 'moderation',
            userPermissions: ["MANAGE_CHANNELS"],
            clientPermissions: ["MANAGE_CHANNELS"]
        });
    }

    async run(message, args) {
        let time = args.pop();
        let timestamp = Number(isNaN(time) ? ms(time) : time);

        if (ms(time) === undefined) return message.reply(message.guild.lang.COMMANDS.SLOWMODE.noDuration);
        if (timestamp > 21600000) return message.reply(message.guild.lang.COMMANDS.SLOWMODE.noValidDuration);

        message.channel.setRateLimitPerUser(timestamp / 1000);
        message.channel.send(message.guild.lang.COMMANDS.SLOWMODE.slowed(isNaN(time) ? ms(ms(time), { long: true }) : ms(Number(time), { long: true })))
    }
}