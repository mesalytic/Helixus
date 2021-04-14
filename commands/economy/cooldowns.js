const {
    MessageEmbed
} = require("discord.js");
const ms = require('parse-ms');
const Command = require("../../structures/Command");

module.exports = class CooldownsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'cooldowns',
            description: "Displays your different cooldowns for economy commands.",
            type: 'economy'
        });
    }

    async run(message) {
        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {
            if (err) throw err;

            let dailyTime = ms(86400000 - (Date.now() - rows[0].dailyCooldown));
            let begTime = ms(900000 - (Date.now() - rows[0].begCooldown));
            let weeklyTime = ms(604800000 - (Date.now() - rows[0].weeklyCooldown));
            let workTime = ms(43200000 - (Date.now() - rows[0].workCooldown));
            let voteTime = ms(43200000 - (Date.now() - rows[0].voteCooldown));
            
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${message.author.tag}'s cooldowns.`)
                .setDescription(`${dailyTime.seconds < 0 ? "✅" : "⌛"} am!daily: ${dailyTime.seconds < 0 ? message.guild.lang.COMMANDS.COOLDOWNS.available : `**${dailyTime.hours}:${dailyTime.minutes}:${dailyTime.seconds}**`}
                ${begTime.seconds < 0 ? "✅" : "⌛"} am!beg: ${begTime.seconds < 0 ? message.guild.lang.COMMANDS.COOLDOWNS.available : `**${begTime.minutes}:${begTime.seconds}**`}
                ${weeklyTime.seconds < 0 ? "✅" : "⌛"} am!weekly: ${weeklyTime.seconds < 0 ? message.guild.lang.COMMANDS.COOLDOWNS.available : `**${weeklyTime.days}:${weeklyTime.hours}:${weeklyTime.minutes}:${weeklyTime.seconds}**`}
                ${workTime.seconds < 0 ? "✅" : "⌛"} am!work: ${workTime.seconds < 0 ? message.guild.lang.COMMANDS.COOLDOWNS.available : `**${workTime.hours}:${workTime.minutes}:${workTime.seconds}**`}
                ${voteTime.seconds < 0 ? "✅" : "⌛"} am!vote: ${voteTime.seconds < 0 ? message.guild.lang.COMMANDS.COOLDOWNS.available : `**${voteTime.hours}:${voteTime.minutes}:${voteTime.seconds}**`}`)

            message.channel.send(embed);
        })
    }
}