const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class CuddleCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'cuddle',
            usage: 'cuddle [user]',
            description: 'Cuddle someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await fetch("https://nekos.life/api/v2/img/cuddle")
        image = await image.json()

        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.CUDDLE.cuddleNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.CUDDLE.cuddleMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.CUDDLE.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}