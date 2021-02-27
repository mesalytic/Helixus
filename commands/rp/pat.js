const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch');
const Command = require("../../structures/Command");

module.exports = class PatCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'pat',
            usage: 'pat [user]',
            description: 'Pat someone!',
            type: 'rp'
        });
    }

    async run(message) {
        let member = message.mentions.members.first() || message.member 
        
        let image = await fetch("https://nekos.life/api/v2/img/pat")
        image = await image.json()

        const embed = new MessageEmbed()
            .setDescription(member === message.member ? message.guild.lang.COMMANDS.PAT.patNoMention(message.member.user.tag) : message.guild.lang.COMMANDS.PAT.patMention(message.member.user.tag, member.user.tag))
            .setColor("RANDOM")
            .setImage(image.url)
            .setFooter(message.guild.lang.COMMANDS.PAT.service)
            .setTimestamp();

        message.channel.send(embed);
    }
}