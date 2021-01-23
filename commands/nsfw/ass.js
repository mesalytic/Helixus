const Command = require("../../structures/Command");

const request = require('node-superfetch');
const { MessageEmbed } = require("discord.js");

module.exports = class AssCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'ass',
            description: 'Displays an NSFW image with ass.',
            type: 'nsfw'
        });
    }

    async run(message) {
        let m = await message.channel.send(message.guild.lang.COMMANDS.ASS.pleaseWait);

        const { body } = await request.get("https://nekobot.xyz/api/image?type=ass");

        let embed = new MessageEmbed()
            .setColor(body.color)
            .setTitle(message.guild.lang.COMMANDS.ASS.requestedBy(message.author.tag), message.author.displayAvatarURL())
            .setDescription(`[${message.guild.lang.COMMANDS.ASS.notDisplaying}](${body.message})`)
            .setImage(body.message)
            .setFooter(message.guild.lang.COMMANDS.ASS.providedBy)
        
        m.edit(null, {embed:embed});
    }
}