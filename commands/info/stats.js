const {
    MessageEmbed, version
} = require("discord.js");
const ms = require('ms');
const os = require("os");
  const cpuStat = require("cpu-stat");
const Command = require("../../structures/Command");

module.exports = class StatsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'stats',
            type: 'info',
            description: 'Shows statistics about the bot.',
            aliases: ["statistics", "botinfo", "info"]
        });
    }

    async run(message, args) {
        const duration = 

        cpuStat.usagePercent((err, percent, seconds) => {
            const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(this.bot.user.username, this.bot.user.avatarURL())
            .setDescription("This bot is licensed under the MIT license, for more info please see the full license **[here](https://github.com/chocololat/Helixus/blob/master/LICENSE)**")
            .addField("• __Developer__", "⚧ MesaVipère ❤#0101")
            .addField("• __Statistics__", `**Servers**: ${this.bot.guilds.cache.size}\n**Users**: ${this.bot.users.cache.size}\n**Channels**: ${this.bot.channels.cache.size}`, true)
			.addField("• __Using__", `\`Discord.js : v${version}\`\n\`Nodejs : v${process.versions.node}\``, true)
            .addField("• __Uptime__", ms(this.bot.uptime), true)
            .addField("• __RAM__", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\``, true)
            .addField(`• __CPU (${percent.toFixed(2)}%)__`, `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``, true)
            .addField("• __Links__", `[**Support server**](https://discord.gg/FR5qwwcEpm)\n[**Invitation Link**](https://discord.com/oauth2/authorize?client_id=437190817195753472&permissions=8&scope=bot)\n[**Website**](https://aliceraina.moe/helixus)`)
            
            message.channel.send(embed);
        })
    }
}