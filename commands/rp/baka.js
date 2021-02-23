const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class BakaCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'baka',
            usage: 'baka [user]',
            description: 'Say to someone he\'s a baka.',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await fetch("https://nekos.life/api/v2/img/baka")
        image = await image.json()

        const embed = new MessageEmbed()
            .setDescription(message.guild.lang.COMMANDS.BAKA.baka(member === message.member ? message.member.user.tag : member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.BAKA.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}