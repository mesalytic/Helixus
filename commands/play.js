const YouTube = require("simple-youtube-api");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const moment = require("moment");
require("moment-duration-format");

module.exports.run = async (bot, message, args, con) => {
  const youtube = new YouTube(bot.config.googlekey);

  const { queue, skipVotes } = bot;

  const input = message.content.split(" ");
  const searchString = input.slice(1).join(" ");
  const url = input[1] ? input[1].replace(/<(.+)>/g, "$1") : "";

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send(bot.lang.musique.play.nochannel);

  async function play(guild, song, seek = 0) {
    const serverQueue = await queue.get(guild.id);

    if (!song) {
      await serverQueue.voiceChannel.leave();
      await queue.delete(guild.id);
      return;
    }

    const stream = await ytdl(song.url, {
      filter: "audioonly",
      quality: "highestaudio",
      volume: 0.125,
    });

    const dispatcher = await serverQueue.connection
      .play(stream, { seek: seek, highWaterMark: 2000 })
      .on("finish", async reason => {
        if (!reason) return;
        if (reason === "Stream is not generating quickly enough.") serverQueue.songs.shift("Stream is not generating quickly enough");
        console.log("END EVENT");
        if (!serverQueue.loop) serverQueue.songs.shift();

        /*if (reason.match("seek")) {
          const seekTo = parseInt(reason.split(" ")[1], 10);
          //serverQueue.songs.unshift(serverQueue.songs[0]);
          await play(guild, serverQueue.songs[0], seekTo);
        }*/

        await play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolume(serverQueue.volume / 120);

    const vote = {
      users: [],
    };
    skipVotes.set(message.guild.id, vote);

    let duration = bot.lang.musique.play.duration.replace(
      "${song.duration}",
      song.duration,
    );
    const embed = new Discord.MessageEmbed()
      .setAuthor(bot.lang.musique.play.starts)
      .setDescription(duration)
      .setThumbnail(song.thumbnail)
      .setColor("RANDOM")
      .setURL(song.url)
      .addField(bot.lang.musique.play.requestedby, song.requestedby, true)
      .setTitle(song.title)
      .setFooter("The bot is deaf for optimization reasons. Do not undeaf it.")

    return message.channel.send({ embed });
  }

  async function handleVideo(video, playlist) {
    const serverQueue = queue.get(message.guild.id);
    const song = {
      duration: moment
        .duration(video.duration)
        .format(`d[d], h[h], m[mins], s[s] `),
      videoduration: video.duration,
      duration_unformated: Math.round(
        video.durationSeconds ? video.durationSeconds : video.duration / 1000,
      ),
      duration_length: moment.duration(video.duration).format(`d[:]h[:]m[:]ss`),
      thumbnail: video.thumbnails.default.url,
      publishedat: video.publishedAt,
      id: video.id,
      requestedby: Discord.escapeMarkdown(message.author.tag),
      title: Discord.escapeMarkdown(
        video.title
          .replace(/&amp;/g, "&")
          .replace(/&gt;/g, ">")
          .replace(/&lt;/g, "<")
          .replace(/&quot;/g, '"')
          .replace(/&OElig;/g, "Œ")
          .replace(/&oelig;/g, "œ")
          .replace(/&Scaron;/g, "Š")
          .replace(/&scaron;/g, "š")
          .replace(/&Yuml;/g, "Ÿ")
          .replace(/&circ;/g, "ˆ")
          .replace(/&tilde;/g, "˜")
          .replace(/&ndash;/g, "–")
          .replace(/&mdash;/g, "—")
          .replace(/&lsquo;/g, "‘")
          .replace(/&rsquo;/g, "’")
          .replace(/&sbquo;/g, "‚")
          .replace(/&ldquo;/g, "“")
          .replace(/&rdquo;/g, "”")
          .replace(/&bdquo;/g, "„")
          .replace(/&dagger;/g, "†")
          .replace(/&Dagger;/g, "‡")
          .replace(/&permil;/g, "‰")
          .replace(/&lsaquo;/g, "‹")
          .replace(/&rsaquo;/g, "›")
          .replace(/&euro;/g, "€")
          .replace(/&copy;/g, "©")
          .replace(/&trade;/g, "™")
          .replace(/&reg;/g, "®")
          .replace(/&nbsp;/g, " "),
      ),
      url: `https://www.youtube.com/watch?v=${video.id}`,
    };

    if (serverQueue) {
      await serverQueue.songs.push(song);
      if (playlist) return;
      let duration = bot.lang.musique.play.duration.replace(
        "${song.duration}",
        song.duration,
      );
      const embed = new Discord.MessageEmbed()
        .setAuthor(bot.lang.musique.play.newqueue)
        .setDescription(duration)
        .setThumbnail(song.thumbnail)
        .setColor("RANDOM")
        .setURL(song.url)
        .setTitle(song.title);
      return message.channel.send({ embed });
    } else {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel,
        connection: null,
        songs: [],
        volume: 10,
        playing: true,
        loop: false,
//      seek: false
       };
      await queue.set(message.guild.id, queueConstruct);

      await queueConstruct.songs.push(song);

      const vote = {
        users: [],
      };

      skipVotes.set(message.guild.id, vote);

      try {
        const connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        await play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        await queue.delete(message.guild.id);
        await skipVotes.delete(message.guild.id);
        return message.channel.send(bot.lang.musique.play.cannotjoin);
      }
    }
  }

  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    const playlist = await youtube.getPlaylist(url);
    const videos = await playlist.getVideos();
    const serverQueue = queue.get(message.guild.id);

    message.channel.send(
      "The playlist is being added, please wait, the first song is gonna be played.",
    );
    for (const video of Object.values(videos)) {
      const video2 = await youtube.getVideoByID(video.id);
      await handleVideo(video2, true);
    }
    const playlistadded = bot.lang.musique.play.playlistadded.replace(
      "${playlist.title}",
      playlist.title,
    );
    return message.channel.send(playlistadded);
  }

  let video;
  try {
    video = await youtube.getVideo(url);
  } catch (error) {
    try {
      const videos = await youtube.searchVideos(searchString, 10);

      let index = 0;
      const embed = new Discord.MessageEmbed()
        .setColor("#7BB3FF")
        .setDescription(
          `${videos
            .map(
              video2 =>
                `**${++index} -** ${video2.title
                  .replace(/&amp;/g, "&")
                  .replace(/&gt;/g, ">")
                  .replace(/&lt;/g, "<")
                  .replace(/&quot;/g, '"')
                  .replace(/&OElig;/g, "Œ")
                  .replace(/&oelig;/g, "œ")
                  .replace(/&Scaron;/g, "Š")
                  .replace(/&scaron;/g, "š")
                  .replace(/&Yuml;/g, "Ÿ")
                  .replace(/&circ;/g, "ˆ")
                  .replace(/&tilde;/g, "˜")
                  .replace(/&ndash;/g, "–")
                  .replace(/&mdash;/g, "—")
                  .replace(/&lsquo;/g, "‘")
                  .replace(/&rsquo;/g, "’")
                  .replace(/&sbquo;/g, "‚")
                  .replace(/&ldquo;/g, "“")
                  .replace(/&rdquo;/g, "”")
                  .replace(/&bdquo;/g, "„")
                  .replace(/&dagger;/g, "†")
                  .replace(/&Dagger;/g, "‡")
                  .replace(/&permil;/g, "‰")
                  .replace(/&lsaquo;/g, "‹")
                  .replace(/&rsaquo;/g, "›")
                  .replace(/&euro;/g, "€")
                  .replace(/&copy;/g, "©")
                  .replace(/&trade;/g, "™")
                  .replace(/&reg;/g, "®")
                  .replace(/&nbsp;/g, " ")}`,
            )
            .join("\n")}`,
        )
        .setAuthor(
          "Song selection",
          "https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg",
        );

      message.channel.send({ embed });

      let response;
      try {
        response = await message.channel.awaitMessages(
          msg2 =>
            msg2.content > 0 &&
            msg2.content < 11 &&
            message.author.id === msg2.author.id,
          {
            max: 1,
            time: 20000,
            errors: ["time"],
          },
        );
      } catch (err) {
        return message.channel.send(
          "No or invalid value entered, cancelling video selection.",
        );
      }
      const videoIndex = parseInt(response.first().content, 10);
      video = await youtube.getVideoByID(videos[videoIndex - 1].id);
    } catch (err) {
      return message.channel.send("I could not obtain any search results.");
    }
  }

  handleVideo(video, false);
};

module.exports.help = {
  name: "play",
  catégorie: "Musique",
  helpcaté: "musique",
};
