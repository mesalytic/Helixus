const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class SlapCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'slap',
            usage: 'slap [user]',
            description: 'Slap someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await fetch("https://nekos.life/api/v2/img/slap")
        image = await image.json()

        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.SLAP.slapNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.SLAP.slapMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.SLAP.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}