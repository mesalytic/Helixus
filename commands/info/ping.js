const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class PingCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'ping',
            usage: 'ping',
            description: 'Displays the bot\'s current **message latency** and **heartbeat**.',
            type: 'info'
        });
    }

    async run(message) {
        const embed = new MessageEmbed()
            .setDescription(`Pong...`)
            .setColor("RANDOM")

        const msg = await message.channel.send(embed);
        const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp;
        const latency = Math.floor(msg.createdTimestamp - timestamp);
        const heartbeat = Math.round(this.bot.ws.ping);

        embed.setDescription(`**P${'o'.repeat(Math.min(Math.round(latency / 100), 1500))}ng!**`)
            .addField('Latency', `\`\`\`ini\n[ ${latency}ms ]\`\`\``, true)
            .addField(message.guild.lang.COMMANDS.PING.latency, `\`\`\`ini\n[ ${heartbeat}ms ]\`\`\``, true)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp();
        msg.edit(embed);
    }
}