const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class KissCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'kiss',
            usage: 'kiss [user]',
            description: 'Kiss someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await fetch("https://nekos.life/api/v2/img/kiss")
        image = await image.json()

        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.KISS.kissNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.KISS.kissMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.KISS.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}