const {
    MessageEmbed
} = require("discord.js");

const Command = require("../../structures/Command");

module.exports = class LyricsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'lyrics',
            description: 'Displays the lyrics about specified song.',
            usage: 'lyrics <song>',
            examples: ["lyrics blinding lights", "lyrics blinding lights the weeknd"],
            type: 'music'
        });
    }

    async run(message, args) {

        const query = args.join(" ");
        if (!query) return message.channel.send('[X] - Please specify a song to search.');



        let lyric = await this.bot.ksoft.lyrics.search(query)

                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`Lyrics for ${lyric[0].name} by ${lyric[0].artist.name}`)
                    .setDescription(lyric[0].lyrics)
                    .setFooter("Lyrics service provided by api.ksoft.si")
                    .setTimestamp();

                if (embed.description.length >= 2048) embed.description = `${embed.description.substr(0, 2045)}...`;
                return message.channel.send(embed);
    }
}