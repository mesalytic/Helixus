const moment = require("moment");
require("moment-duration-format");
const Command = require("../../structures/Command");

module.exports = class UptimeCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'uptime',
            description: 'Displays the bot\'s current **uptime**.',
            type: 'info'
        });
    }

    async run(message) {
        let uptime = moment.duration(this.bot.uptime).format("D [j], H[h] m[m] s[s]");
        return message.channel.send(message.guild.lang.COMMANDS.UPTIME.uptime(uptime));
    }
}