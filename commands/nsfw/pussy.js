const Command = require("../../structures/Command");

const request = require('node-superfetch');
const { MessageEmbed } = require("discord.js");

module.exports = class PussyCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'pussy',
            description: 'Displays an NSFW image with pussy.',
            type: 'nsfw'
        });
    }

    async run(message) {
        let m = await message.channel.send(message.guild.lang.COMMANDS.PUSSY.pleaseWait);

        const { body } = await request.get("https://nekobot.xyz/api/image?type=pussy");

        let embed = new MessageEmbed()
            .setColor(body.color)
            .setTitle(message.guild.lang.COMMANDS.PUSSY.requestedBy(message.author.tag), message.author.displayAvatarURL())
            .setDescription(`[${message.guild.lang.COMMANDS.PUSSY.notDisplaying}](${body.message})`)
            .setImage(body.message)
            .setFooter(message.guild.lang.COMMANDS.PUSSY.providedBy)
        
        m.edit(null, {embed:embed});
    }
}