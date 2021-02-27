const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class SmugCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'smug',
            usage: 'smug [user]',
            description: 'Smug someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await fetch("https://nekos.life/api/v2/img/smug")
        image = await image.json()

        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.SMUG.smugNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.SMUG.smugMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.SMUG.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}