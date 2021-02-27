const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class LickCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'lick',
            usage: 'lick [user]',
            description: 'Lick someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await this.bot.ksoft.images.random("lick", false);
        
        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.LICK.lickNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.LICK.lickMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.LICK.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}