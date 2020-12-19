const {
    WebhookClient,
    MessageEmbed
} = require("discord.js");


module.exports = async (bot, guild, user) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${guild.id}'`, async (err, logsSettings) => {
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${guild.id}'`, async (err, rows) => {
            let {
                GUILDBANADD: lang
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`).EVENTS;
            if (logsSettings[0]) {
                if (logsSettings[0].channelID) {
                    if (logsSettings[0].activated === "true") {
                        if (logsSettings[0].guildbanadd === "true") {
                            if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                                let embed = new MessageEmbed()
                                    .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`)
                                    .setDescription(lang.banned(user))
                                    .addField(lang.userInfos, `${user.username}#${user.discriminator} (${user.id}) ${user.bot ? lang.isBot : ''}`, true)
                                    .addField(lang.reason, lang.none, true)
                                    .addField(lang.bannedBy, lang.unknownUser, true)
                                    .setColor("RANDOM")
                                    .setTimestamp();

                                await setTimeout(async () => {
                                    const logs = await guild.fetchAuditLogs({
                                        limit: 5,
                                        type: 22
                                    }).catch(() => {
                                        return
                                    });
                                    if (!logs) return;

                                    const log = logs.entries.first()

                                    const perp = guild.members.resolve(log.executor.id);

                                    if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                        if (log.reason) embed.fields[1].value = log.reason
                                        embed.fields[2].value = `${perp.user} (${perp.user.id})`
                                        embed.footer = {
                                            text: `${perp.user.username}#${perp.user.discriminator}`,
                                            icon_url: `https://cdn.discordapp.com/avatars/${perp.user.id}/${perp.user.avatar}.png?size=512`
                                        }
                                        await webhook.send(embed);
                                    } else {
                                        await webhook.send(embed);
                                    }
                                }, 1000)
                            }
                        }
                    }
                }
            }
        })
    })
}