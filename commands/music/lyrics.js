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
        if (!query) return message.channel.send(message.guild.lang.COMMANDS.LYRICS.noQuery);

        let lyric = await this.bot.ksoft.lyrics.search(query)

        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(message.guild.lang.COMMANDS.LYRICS.embedTitle(lyric[0].name, lyric[0].artist.name))
            .setDescription(lyric[0].lyrics)
            .setFooter(message.guild.lang.COMMANDS.LYRICS.embedFooter)
            .setTimestamp();

        if (embed.description.length >= 2048) embed.description = `${embed.description.substr(0, 2045)}...`;
        return message.channel.send(embed);
    }
}