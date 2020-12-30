const Command = require("../../structures/Command");

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
        if (!queue) return message.reply(message.guild.lang.COMMANDS.VOLUME.noQueue).catch(console.error);

        if (!args[0]) return message.channel.send(message.guild.lang.COMMANDS.VOLUME.volume(queue.volume))

        if (isNaN(args[0]) || parseInt(args[0]) > 100 || parseInt(args[0]) < 0) return this.bot.commands.get("help").run(message, ["volume"]);

        queue.volume = parseInt(args[0]);
        queue.connection.dispatcher.setVolumeLogarithmic(parseInt(args[0]) / 100);

        message.channel.send(message.guild.lang.COMMANDS.VOLUME.success(parseInt(args[0])))
    }
}