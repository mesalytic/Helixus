const Command = require("../../structures/Command");

const request = require('node-superfetch');
const { MessageEmbed } = require("discord.js");

module.exports = class AnalCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'anal',
            description: 'Displays an NSFW image with anal.',
            type: 'nsfw'
        });
    }

    async run(message) {
        let m = await message.channel.send(message.guild.lang.COMMANDS.ANAL.pleaseWait);

        const { body } = await request.get("https://nekobot.xyz/api/image?type=anal");

        let embed = new MessageEmbed()
            .setColor(body.color)
            .setTitle(message.guild.lang.COMMANDS.ANAL.requestedBy(message.author.tag), message.author.displayAvatarURL())
            .setDescription(`[${message.guild.lang.COMMANDS.ANAL.notDisplaying}](${body.message})`)
            .setImage(body.message)
            .setFooter(message.guild.lang.COMMANDS.ANAL.providedBy)
        
        m.edit(null, {embed:embed});
    }
}