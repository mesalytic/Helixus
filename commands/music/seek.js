const Command = require("../../structures/Command");

module.exports = class SeekCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'seek',
            description: 'Allows you to set the music to a specific point.',
            usage: "seek <time>",
            examples: ["seek 0:0:20", "seek 0:1:20", "seek 1:20"],
            type: 'music'
        });
    }

    async run(message, args) {
        const queue = this.bot.queue.get(message.guild.id);
        if (!queue) return message.reply(message.guild.lang.COMMANDS.SEEK.noQueue).catch(console.error);
        if (queue && message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(message.guild.lang.COMMANDS.PLAY.notSameVoiceChannel)

        if (!args[0]) return this.bot.commands.get("help").run(message, ["seek"]);

        let time = args[0].split(":");
        if (!time[2]) return this.bot.commands.get("help").run(message, ["seek"]);

        let timeSeconds = Number(time[0] * 3600) + Number(time[1] * 60) + Number(time[2]);
        if (timeSeconds > queue.songs[0].duration) message.reply(message.guild.lang.COMMANDS.SEEK.notThatLong);

        queue.seek = timeSeconds
        message.channel.send(message.guild.lang.COMMANDS.SEEK.success(args[0]))
        await queue.connection.dispatcher.emit('finish', `seek ${timeSeconds}`)
    }
}