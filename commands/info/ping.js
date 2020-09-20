const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class PingCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'ping',
            usage: 'ping',
            description: 'Displays the bot\'s current **message latency** and **API latency**.',
            type: 'info'
        });
    }

    async run(message) {
        const embed = new MessageEmbed()
            .setDescription(`Pinging...`)
            .setColor("RANDOM")

        const msg = await message.channel.send(embed);
        const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp;
        const latency = `\`\`\`ini\n[ ${Math.floor(msg.createdTimestamp - timestamp)}ms ]\`\`\``;
    const apiLatency = `\`\`\`ini\n[ ${Math.round(this.bot.ws.ping)}ms ]\`\`\``;

    embed.setTitle(`Pong!`)
        .setDescription('')
        .addField('Latency', latency, true)
        .addField('API Latency', apiLatency, true)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
    msg.edit(embed);
    }
}