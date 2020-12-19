const {
    WebhookClient,
    MessageEmbed
} = require("discord.js");

module.exports = async (bot, role) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${role.guild.id}'`, async (err, logsSettings) => {
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${role.guild.id}'`, async (err, rows) => {
            let {
                ROLEDELETE: lang
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`).EVENTS;
            if (logsSettings[0]) {
                if (logsSettings[0].channelID) {
                    if (logsSettings[0].activated === "true") {
                        if (logsSettings[0].roledelete === "true") {
                            if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                                let embed = new MessageEmbed()
                                    .setAuthor(lang.unknownUser)
                                    .setDescription(lang.deleted)
                                    .addField("Role", `**${role.name}**\n**${role.id}**`, true)
                                    .addField(lang.deletedBy, lang.deletedLeft, true)
                                    .setColor("RANDOM")
                                    .setTimestamp();


                                await setTimeout(async () => {
                                    const logs = await role.guild.fetchAuditLogs({
                                        limit: 5,
                                        type: 32
                                    }).catch(() => {
                                        return
                                    });
                                    if (!logs) return;

                                    const log = logs.entries.first()
                                    const executor = role.guild.members.cache.get(log.executor.id);
                                    const member = role.guild.members.cache.get(executor.id);

                                    if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                        embed.author.name = `${member.user.username}#${member.user.discriminator} ${member.nick ? `(${member.nick})` : ''}`
                                        embed.author.iconURL = `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`;
                                        embed.fields[1].value = member

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