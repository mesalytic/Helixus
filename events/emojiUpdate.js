const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

module.exports = async (bot, oldEmoji, newEmoji) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${oldEmoji.guild.id}'`, async (err, logsSettings) => {
        if (logsSettings[0]) {
            if (logsSettings[0].channelID) {
                if (logsSettings[0].activated = "true") {
                    if (logsSettings[0].emojiupdate === "true") {
                        if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                            const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                            let embed = new MessageEmbed()
                                .setAuthor('Unknown User')
                                .setDescription(`Emoji updated (**${newEmoji.name}** [\`<:${newEmoji.name}:${newEmoji.id}>\`])`)
                                .addField("Created by", `Unknown`, true)
                                .addField("Old Name", oldEmoji.name, true)
                                .addField("New Name", newEmoji.name, true)
                                .addField("Emoji ID", newEmoji.id, true)
                                .setThumbnail("https://canary.discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                                .setColor("RANDOM")
                                .setTimestamp();

                            await setTimeout(async () => {
                                const logs = await newEmoji.guild.fetchAuditLogs({
                                    limit: 5,
                                    type: 61
                                }).catch(() => {
                                    return
                                });
                                if (!logs) return;

                                const log = logs.entries.first()
                                const executor = newEmoji.guild.members.cache.get(log.executor.id);

                                if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                    embed.author.name = `${executor.user.username}#${executor.user.discriminator} ${executor.nick ? `(${executor.nick})` : ''}`
                                    embed.author.iconURL = `https://cdn.discordapp.com/avatars/${executor.id}/${executor.user.avatar}.png?size=512`;
                                    embed.fields[0].value = executor
                                    embed.thumbnail.url = `https://cdn.discordapp.com/emojis/${newEmoji.id}.png`

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
}