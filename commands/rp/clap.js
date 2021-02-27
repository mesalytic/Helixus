const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class ClapCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'clap',
            usage: 'clap [user]',
            description: 'Clap someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await this.bot.ksoft.images.random("clap", false);
        
        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.CLAP.clapNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.CLAP.clapMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.CLAP.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}