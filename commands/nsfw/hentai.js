const Command = require("../../structures/Command");

const request = require('node-superfetch');
const { MessageEmbed } = require("discord.js");

module.exports = class HentaiCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'hentai',
            description: 'Displays an NSFW image with hentai.',
            type: 'nsfw'
        });
    }

    async run(message) {
        let m = await message.channel.send(message.guild.lang.COMMANDS.HENTAI.pleaseWait);

        const { body } = await request.get("https://nekobot.xyz/api/image?type=hentai");

        let embed = new MessageEmbed()
            .setColor(body.color)
            .setTitle(message.guild.lang.COMMANDS.HENTAI.requestedBy(message.author.tag), message.author.displayAvatarURL())
            .setDescription(`[${message.guild.lang.COMMANDS.HENTAI.notDisplaying}](${body.message})`)
            .setImage(body.message)
            .setFooter(message.guild.lang.COMMANDS.HENTAI.providedBy)
        
        m.edit(null, {embed:embed});
    }
}