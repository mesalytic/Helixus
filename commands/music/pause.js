const Command = require("../../structures/Command");

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
        if (!queue) return message.reply(message.guild.lang.COMMANDS.PAUSE.noQueue).catch(console.error);
        if (queue && message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(message.guild.lang.COMMANDS.PLAY.notSameVoiceChannel)
        
        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            return queue.textChannel.send(message.guild.lang.COMMANDS.PAUSE.success(message.author)).catch(console.error);
        }
    }
}