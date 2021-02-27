const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class HugCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'hug',
            usage: 'hug [user]',
            description: 'Hug someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await fetch("https://nekos.life/api/v2/img/hug")
        image = await image.json()

        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.HUG.hugNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.HUG.hugMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.HUG.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}