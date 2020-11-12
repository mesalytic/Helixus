const Command = require("../../structures/Command");
const config = require('../../config.json');

let YOUTUBE_KEY = config.youtube;

const YoutubeAPI = require("simple-youtube-api");
const youtube = new YoutubeAPI(YOUTUBE_KEY);
const scdl = require('soundcloud-downloader');
const ytdl = require('discord-ytdl-core');
const {
    MessageEmbed
} = require("discord.js");
const {
    canModifyQueue
} = require("../../structures/Utils");

module.exports = class PlayCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'play',
            description: "Allows you to play music from YouTube or SoundCloud!",
            usage: "play <search | YouTube/SoundCloud URL>",
            type: 'music',
            examples: ["play The Chainsmokers", "play https://www.youtube.com/watch?v=dQw4w9WgXcQ", "play https://soundcloud.com/abvssmalx/shallow-waters"],
            clientPermissions: ["SPEAK", "CONNECT"]
        });
    }

    async run(message, args) {
        const {
            channel: voiceChannel
        } = message.member.voice;
        console.log(voiceChannel);

        const serverQueue = this.bot.queue.get(message.guild.id);
        if (!voiceChannel) return message.reply("You need to join a voice channel first!");

        if (serverQueue && voiceChannel !== message.guild.me.voice.channel) return message.reply("You need to be in the same voice channel as the bot.")

        if (!args.length) return this.bot.commands.get("help").run(message, ["play"])

        const permissions = voiceChannel.permissionsFor(this.bot.user);
        if (!permissions.has("CONNECT")) return message.reply("Missing permission: `CONNECT`");
        if (!permissions.has("SPEAK")) return message.reply("Missing permission: `SPEAK`");

        const search = args.join(" ");
        const videoRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistYTRegex = /^.*(list=)([^#\&\?]*).*/gi;
        const soundcloudRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
        const url = args[0];
        const urlValid = videoRegex.test(args[0]);

        if (!videoRegex.test(args[0]) && playlistYTRegex.test(args[0])) return message.reply("Playlist support isn't ready yet!");
        else if (scdl.isValidUrl(url) && url.includes("/sets")) return message.reply("SoundCloud support is not available yet!");

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

        let song;

        if (urlValid) {
            try {
                let infos = await youtube.getVideo(url);
                song = {
                    title: infos.title,
                    url: infos.url,
                    duration: infos.durationSeconds
                }
            } catch (e) {
                console.error(e);
                return message.reply(e.message).catch(console.error);
            }
        } else if (soundcloudRegex.test(url)) {
            try {
                const infos = await scdl.getInfo(url, config.soundcloud);
                song = {
                    title: infos.title,
                    url: infos.permalink_url,
                    duration: Math.ceil(infos.duration / 1000)
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        } else {
            try {
                const results = await youtube.searchVideos(search, 10);
                let index = 0;
                const embed = new MessageEmbed()
                    .setColor("#7BB3FF")
                    .setDescription(`${results.map(video2 => `**${++index} -** ${video2.title.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&OElig;/g, "Œ").replace(/&oelig;/g, "œ").replace(/&Scaron;/g, "Š").replace(/&scaron;/g, "š").replace(/&Yuml;/g, "Ÿ").replace(/&circ;/g, "ˆ").replace(/&tilde;/g, "˜").replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&lsquo;/g, "‘").replace(/&rsquo;/g, "’").replace(/&sbquo;/g, "‚").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”").replace(/&bdquo;/g, "„").replace(/&dagger;/g, "†").replace(/&Dagger;/g, "‡").replace(/&permil;/g, "‰").replace(/&lsaquo;/g, "‹").replace(/&rsaquo;/g, "›").replace(/&euro;/g, "€").replace(/&copy;/g, "©").replace(/&trade;/g, "™").replace(/&reg;/g, "®").replace(/&nbsp;/g, " ")}`).join("\n")}`)
                    .setAuthor("Song selection", "https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg");

                message.channel.send({
                    embed
                });
                let response;
                try {
                    response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11 && message.author.id === msg2.author.id, {
                        max: 1,
                        time: 20000,
                        errors: ["time"],
                    });
                } catch (err) {
                    console.error(error);
                    return message.reply(error.message).catch(console.error);
                }

                const videoIndex = parseInt(response.first().content, 10);
                let infos = await youtube.getVideoByID(results[videoIndex - 1].id);
                song = {
                    title: infos.title,
                    url: infos.url,
                    duration: infos.durationSeconds
                }

            } catch (e) {
                console.error(e);
                return message.reply(e.message).catch(console.error);
            }
        }

        if (serverQueue) {
            serverQueue.songs.push(song);
            return serverQueue.textChannel
                .send(`✅ - **${song.title}** has been added to the queue by ${message.author}`)
                .catch(console.error);
        }

        queueConstruct.songs.push(song);
        this.bot.queue.set(message.guild.id, queueConstruct);

        try {
            queueConstruct.connection = await voiceChannel.join();
            await queueConstruct.connection.voice.setSelfDeaf(true);
            await queueConstruct.connection.voice.setSelfMute(true);
            play(queueConstruct.songs[0], message, this.bot);
        } catch (error) {
            console.error(error);
            this.bot.queue.delete(message.guild.id);
            await voiceChannel.leave();
            return message.channel.send(`Could not join the channel: ${error}`).catch(console.error);
        }

        async function play(song, message, bot, seek = 0) {
            const queue = bot.queue.get(message.guild.id);

            if (!song) {
                queue.voiceChannel.leave();
                bot.queue.delete(message.guild.id);
                return queue.textChannel.send("🚫 Music queue ended.").catch(console.error);
            }

            let stream = null;

            try {
                if (song.url.includes("youtube.com")) {
                    stream = await ytdl(song.url, {
                        filter: "audioonly",
                        opusEncoded: false,
                        fmt: "mp3",
                    });
                } else if (song.url.includes("soundcloud.com")) {
                    stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, config.soundcloud);
                }
            } catch (error) {
                if (queue) {
                    queue.songs.shift();
                    play(queue.songs[0], message, bot);
                }

                console.error(error);
                return message.channel.send(`Error: ${error.message ? error.message : error}`);
            }
            queue.connection.on("disconnect", () => bot.queue.delete(message.guild.id));

            const dispatcher = queue.connection
                .play(stream, {
                    type: "unknown",
                    seek: seek
                })
                .on("finish", reason => { //Don't really count on the callback for everything, not officially supported
                    if (reason) {
                        if (reason.match(`seek`)) {
                            let seekTo = reason.split(" ")[1];
    
                            play(queue.songs[0], message, bot, seekTo);
                        }
                    } else {
                        if (queue.loop) {
                            let lSong = queue.songs.shift();
                            queue.songs.push(lSong);
                            queue.seek = 0;
                            play(queue.songs[0], message, bot);
                        } else {
                            queue.songs.shift();
                            queue.seek = 0;
                            play(queue.songs[0], message, bot);
                        }
                    }
                })
                .on("error", (err) => {
                    console.error(err);
                    queue.songs.shift();
                    play(queue.songs[0], message, bot);
                })
            dispatcher.setVolumeLogarithmic(queue.volume / 100);

            if (seek == 0) queue.textChannel.send(`🎶 Started playing: **${song.title}** <${song.url}>`);
        }
    }
}