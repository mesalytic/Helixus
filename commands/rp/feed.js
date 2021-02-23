const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class FeedCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'feed',
            usage: 'feed [user]',
            description: 'Feed someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await fetch("https://nekos.life/api/v2/img/feed")
        image = await image.json()

        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.FEED.feedNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.FEED.feedMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.FEED.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}