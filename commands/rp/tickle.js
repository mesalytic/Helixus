const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class TickleCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'tickle',
            usage: 'tickle [user]',
            description: 'Tickle someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await fetch("https://nekos.life/api/v2/img/tickle")
        image = await image.json()

        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.TICKLE.tickleNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.TICKLE.tickleMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.TICKLE.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}