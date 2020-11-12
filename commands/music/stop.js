const Command = require("../../structures/Command");
const {
    canModifyQueue
} = require("../../structures/Utils");

module.exports = class StopCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'stop',
            usage: "stop",
            type: 'music'
        });
    }

    async run(message, args) {
        const queue = this.bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);

        if (!canModifyQueue(message.member)) return;

        queue.songs = [];
        queue.connection.dispatcher.end();
        queue.textChannel.send(`⏹ ${message.author} has stopped the music!`)
    }
}