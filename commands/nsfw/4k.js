const Command = require("../../structures/Command");

const request = require('node-superfetch');
const { MessageEmbed } = require("discord.js");

module.exports = class FourKCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: '4k',
            description: 'Displays a 4K categorized NSFW picture.',
            type: 'nsfw',
            cooldown: 10
        });
    }

    async run(message) {
        let m = await message.channel.send(message.guild.lang.COMMANDS.FOURK.pleaseWait);

        const { body } = await request.get("https://nekobot.xyz/api/image?type=4k");

        let embed = new MessageEmbed()
            .setColor(body.color)
            .setTitle(message.guild.lang.COMMANDS.FOURK.requestedBy(message.author.tag), message.author.displayAvatarURL())
            .setDescription(`[${message.guild.lang.COMMANDS.FOURK.notDisplaying}](${body.message})`)
            .setImage(body.message)
            .setFooter(message.guild.lang.COMMANDS.FOURK.providedBy)
        
        m.edit(null, {embed:embed});
    }
}