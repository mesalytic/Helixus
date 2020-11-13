const Command = require("../../structures/Command");
const {
    canModifyQueue
} = require("../../structures/Utils");

module.exports = class SeekCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'seek',
            usage: "seek <time>",
            examples: ["seek 0:0:20", "seek 0:1:20", "seek 1:20"],
            type: 'music'
        });
    }

    async run(message, args) {
        const queue = this.bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);

        if (!args[0]) return this.bot.commands.get("help").run(message, ["seek"]);

        let time = args[0].split(":");
        if (!time[2]) return this.bot.commands.get("help").run(message, ["seek"]);

        let timeSeconds = Number(time[0] * 3600) + Number(time[1] * 60) + Number(time[2]);
        if (timeSeconds > queue.songs[0].duration) message.reply("The song isn't that long!");

        queue.seek = timeSeconds
        message.channel.send(`✅ - The song has seeked to **${args[0]}**!`)
        await queue.connection.dispatcher.emit('finish', `seek ${timeSeconds}`)
    }
}