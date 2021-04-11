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
        cpuStat.usagePercent((err, percent, _) => {
            const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(this.bot.user.username, this.bot.user.displayAvatarURL())
            .setDescription(message.guild.lang.COMMANDS.STATS.license)
            .addField(message.guild.lang.COMMANDS.STATS.developer, this.bot.users.cache.get("604779545018761237").tag)
            .addField(message.guild.lang.COMMANDS.STATS.statistics, message.guild.lang.COMMANDS.STATS.statisticsValue(this.bot.guilds.cache.size, this.bot.users.cache.size, this.bot.channels.cache.size), true)
			.addField(message.guild.lang.COMMANDS.STATS.using, `\`Discord.js : v${version}\`\n\`Nodejs : v${process.versions.node}\``, true)
            .addField(message.guild.lang.COMMANDS.STATS.uptime, ms(this.bot.uptime), true)
            .addField(message.guild.lang.COMMANDS.STATS.ram, `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\``, true)
            .addField(message.guild.lang.COMMANDS.STATS.cpu(percent), `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``, true)
            .addField(message.guild.lang.COMMANDS.STATS.links, `[**${message.guild.lang.COMMANDS.STATS.supportServer}**](https://discord.gg/FR5qwwcEpm)\n[**${message.guild.lang.COMMANDS.STATS.invitationLink}**](https://discord.com/oauth2/authorize?client_id=437190817195753472&permissions=8&scope=bot)\n[**${message.guild.lang.COMMANDS.STATS.website}**](https://aliceraina.moe/helixus)`)
            
            message.channel.send(embed);
        })
    }
}