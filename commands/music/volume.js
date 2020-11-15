const Command = require("../../structures/Command");
const { canModifyQueue } = require("../../structures/Utils");

module.exports = class VolumeCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'volume',
            description: 'Changes the volume of the playing song.',
            usage: 'volume <number 0-100>',
            examples: ["volume 60"],
            type: 'music'
        });
    }

    async run(message, args) {
        const queue = this.bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (!args[0]) return message.channel.send(`🔊 - The volume is at **${queue.volume}%**.`)

        if (isNaN(args[0]) || parseInt(args[0]) > 100 | parseInt(args[0]) < 0) return this.bot.commands.get("help").run(message, ["volume"]);

        queue.volume = args[0];
        queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

        message.channel.send(`✅ - Volume has been set to **${args[0]}%**!`)
    }
}