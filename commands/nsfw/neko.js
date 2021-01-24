const Command = require("../../structures/Command");

const request = require('node-superfetch');
const { MessageEmbed } = require("discord.js");

module.exports = class NekoCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'neko',
            description: 'Displays an NSFW image with neko.',
            type: 'nsfw'
        });
    }

    async run(message) {
        let m = await message.channel.send(message.guild.lang.COMMANDS.NEKO.pleaseWait);

        const { body } = await request.get("https://nekobot.xyz/api/image?type=hneko");

        let embed = new MessageEmbed()
            .setColor(body.color)
            .setTitle(message.guild.lang.COMMANDS.NEKO.requestedBy(message.author.tag), message.author.displayAvatarURL())
            .setDescription(`[${message.guild.lang.COMMANDS.NEKO.notDisplaying}](${body.message})`)
            .setImage(body.message)
            .setFooter(message.guild.lang.COMMANDS.NEKO.providedBy)
        
        m.edit(null, {embed:embed});
    }
}