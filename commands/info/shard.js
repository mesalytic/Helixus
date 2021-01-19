const moment = require("moment");
require("moment-duration-format");
const Command = require("../../structures/Command");

module.exports = class ShardCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'shard',
            description: 'Displays the bot\'s current **shard**.',
            type: 'info'
        });
    }

    async run(message) {
        return message.channel.send(message.guild.lang.COMMANDS.SHARD.shard(this.bot.shard.ids[0] + 1, this.bot.shard.count));
    }
}