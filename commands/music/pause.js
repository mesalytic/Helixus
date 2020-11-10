const Command = require("../../structures/Command");
const {
    canModifyQueue
} = require("../../structures/Utils");

module.exports = class PauseCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'pause',
            description: 'Pauses the musics that its currently playing.',
            usage: "pause",
            type: 'music'
        });
    }

    async run(message) {
        const queue = this.bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            return queue.textChannel.send(`⏸ ${message.author} has paused the music.`).catch(console.error);
        }
    }
}