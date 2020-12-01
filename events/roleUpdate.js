const {
    WebhookClient,
    MessageEmbed
} = require("discord.js");

module.exports = async (bot, oldRole, newRole) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${newRole.guild.id}'`, async (err, logsSettings) => {
        if (logsSettings[0]) {
            if (logsSettings[0].channelID) {
                if (logsSettings[0].activated === "true") {
                    if (logsSettings[0].roleupdate === "true") {
                        if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                            const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                            const embed = new MessageEmbed()
                                .setAuthor("Unknown Executor")
                                .setDescription(`**The role ${newRole} has been updated (${newRole.id})**`)
                                .addField('Updated by', 'Unknown')
                                .setColor(newRole.color ? newRole.color : "RANDOM")
                                .setTimestamp()


                            const oldKeys = Object.keys(oldRole);
                            oldKeys.forEach(prop => {
                                console.log(oldRole.permissions.toString());
                                console.log(newRole.permissions.toString());
                                if (newRole[prop].toString() !== oldRole[prop].toString() && prop !== 'position') {
                                    if (prop === 'color') {
                                        embed.fields.unshift({
                                            name: toTitleCase(prop),
                                            value: `__**Now**__: **${intToHex(newRole[prop])}**\n__**Was**__: **${intToHex(oldRole[prop])}**`,
                                            inline: true
                                        })
                                    } else {
                                        embed.fields.unshift({
                                            name: toTitleCase(prop),
                                            value: `__**Now**__: **${newRole[prop]}**\n__**Was**__: **${oldRole[prop]}**`,
                                            inline: true
                                        })
                                    }
                                } else if (prop === 'permissions' && JSON.stringify(newRole[prop]) !== JSON.stringify(oldRole[prop])) {
                                    embed.fields.unshift({
                                        name: `${toTitleCase(prop)}`,
                                        value: `__**Now**__: **${JSON.stringify(newRole[prop])}**\n__**Was**__: **${JSON.stringify(oldRole[prop])}**\n\n`,
                                        inline: true
                                    })
                                    embed.footer = {
                                        text: 'Please check the audit logs to see what specific permissions were changed.'
                                    }
                                }
                            })
                            if (embed.fields.length === 0) return;

                            await setTimeout(async () => {
                                const logs = await newRole.guild.fetchAuditLogs({
                                    limit: 5,
                                    type: 31
                                }).catch(() => {
                                    return
                                });
                                if (!logs) return;


                                const log = logs.entries.find(e => e.target.id === newRole.id);
                                if (!log) return await webhook.send(embed);

                                if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() > 3000) return;
                                const executor = newRole.guild.members.cache.get(log.executor.id);
                                embed.fields[embed.fields.length - 1].value = executor;
                                embed.author.name = `${executor.user.username}#${executor.user.discriminator}`
                                embed.author.iconURL = `https://cdn.discordapp.com/avatars/${executor.id}/${executor.user.avatar}.png?size=512`;

                                await webhook.send(embed);
                            }, 1000)
                        }
                    }
                }
            }
        }
    })

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        })
    }

    function intToHex(num) {
        num >>>= 0;
        const b = num & 0xFF;
        const g = (num & 0xFF00) >>> 8;
        const r = (num & 0xFF0000) >>> 16;
        return rgbToHex(r, g, b);
    }

    function rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
}