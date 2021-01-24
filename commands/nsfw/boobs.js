const Command = require("../../structures/Command");

const request = require('node-superfetch');
const { MessageEmbed } = require("discord.js");

module.exports = class BoobsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'boobs',
            description: 'Displays an NSFW picture with boobs.',
            type: 'nsfw'
        });
    }

    async run(message) {
        let m = await message.channel.send(message.guild.lang.COMMANDS.BOOBS.pleaseWait);

        const { body } = await request.get("https://nekobot.xyz/api/image?type=boobs");

        let embed = new MessageEmbed()
            .setColor(body.color)
            .setTitle(message.guild.lang.COMMANDS.BOOBS.requestedBy(message.author.tag), message.author.displayAvatarURL())
            .setDescription(`[${message.guild.lang.COMMANDS.BOOBS.notDisplaying}](${body.message})`)
            .setImage(body.message)
            .setFooter(message.guild.lang.COMMANDS.BOOBS.providedBy)
        
        m.edit(null, {embed:embed});
    }
}