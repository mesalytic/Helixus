const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");
const {
    canModifyQueue
} = require("../../structures/Utils");
const createBar = require("string-progressbar");

module.exports = class NowPlayingCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'nowplaying',
            description: 'Shows what music is currently playing.',
            usage: "nowplaying",
            type: 'music',
            aliases: ['np', 'playing']
        });
    }

    async run(message) {
        const queue = this.bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);

        const song = queue.songs[0];
        const seek = ((queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000) + queue.seek;
        const left = song.duration - seek;

        let nowPlaying = new MessageEmbed()
            .setAuthor(`Now playing: ${song.title}`, null, song.url)
            .setColor("RANDOM")

        if (song.duration > 0) {
            nowPlaying.setDescription(new Date(seek * 1000).toISOString().substr(11, 8) + "[" + createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] + "]" + (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)), false);
            nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
        }

        return message.channel.send(nowPlaying);
    }
}