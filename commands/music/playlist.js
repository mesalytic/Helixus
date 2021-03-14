const Command = require("../../structures/Command");
const config = require('../../config.json');

const YoutubeAPI = require("simple-youtube-api");
const youtube = new YoutubeAPI(config.youtube);
const scdl = require('soundcloud-downloader').default;
const {
    MessageEmbed
} = require("discord.js");

module.exports = class PlayCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'playlist',
            description: "Allows you to load playlists from YouTube or SoundCloud!",
            usage: "play <search | YouTube/SoundCloud Playlist URL>",
            type: 'music',
            clientPermissions: ["SPEAK", "CONNECT"]
        });
    }

    async run(message, args) {
        const {
            channel: voiceChannel
        } = message.member.voice;
        const serverQueue = this.bot.queue.get(message.guild.id);

        if (!args[0]) return this.bot.commands.get("help").run(message, ["playlist"]);

        if (!voiceChannel) return message.reply(message.guild.lang.COMMANDS.PLAYLIST.notInVC);
        if (serverQueue && voiceChannel !== message.guild.me.voice.channel) return message.reply(message.guild.lang.COMMANDS.PLAYLIST.notInSameVC);

        const search = args.join(" ");
        const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = pattern.test(args[0]);

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            songs: [],
            loop: false,
            seek: 0,
            volume: 100,
            playing: true
        }

        let playlist = null;
        let videos = [];

        if (urlValid) {
            try {
                playlist = await youtube.getPlaylist(url, { part: "snippet" });
                videos = await playlist.getVideos(10, { part: "snippet " });
            } catch (e) {
                console.error(e);
                return message.reply(e.message).catch(console.error);
            }
        } else if (scdl.isPlaylistURL(args[0])) {
            if (args[0].includes("/sets/")) {
                message.channel.send(message.guild.lang.COMMANDS.PLAYLIST.fetching);
                playlist = await scdl.getSetInfo(args[0], config.soundcloud);
                videos = playlist.tracks.map((track) => ({
                    title: track.title,
                    url: track.permalink_url,
                    duration: track.duration / 1000
                }));
            }
        } else {
            try {
                const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
                playlist = results[0];
                videos = await playlist.getVideos(10, { part: "snippet" });
            } catch (e) {
                console.error(e);
                return message.reply(e.message).catch(console.error);
            }
        }

        const newSongs = videos
        .filter((video) => video.title != "Private video" && video.title != "Deleted video")
        .map((video) => {
            return ({
                title: video.title,
                url: video.url,
                duration: video.durationSecords
            });
        });

        serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

        let embed = new MessageEmbed()
        .setTitle(playlist.title)
        .setDescription(newSongs.map((song, index) => `${index + 1}. ${song.title}`))
        .setURL(playlist.url)
        .setColor("RANDOM")
        .setTimestamp();

        if (embed.description.length >= 2048) embed.description = embed.description.substr(0, 2007) + "Playlist larger than character limit...";

        message.channel.send(message.guild.lang.COMMANDS.PLAYLIST.startedPlaylist(message.author), embed);

        if (!serverQueue) {
            this.bot.queue.set(message.guild.id, queueConstruct);

            try {
                queueConstruct.connection = await voiceChannel.join();
                await queueConstruct.connection.voice.setSelfDeaf(true);
                this.bot.commands.get('play').play(queueConstruct.songs[0], message);
            } catch (e) {
                console.error(e);
                this.bot.queue.delete(message.guild.id);
                await voiceChannel.leave();
                return message.reply(message.guild.lang.COMMANDS.PLAYLIST.cannotJoin).catch(console.error);
            }
        }
    }
}