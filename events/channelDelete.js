const { WebhookClient, MessageEmbed } = require("discord.js");
const CHANNEL_TYPES = {
    'text': 'Text Channel',
    'voice': 'Voice Channel',
    'category': 'Category'
}

module.exports = async (bot, channel) => {
    if (channel.type === "dm") return;

    bot.db.query(`SELECT * FROM Logs WHERE guildID='${channel.guild.id}'`, async (err, logsSettings) => {
        if (logsSettings[0]) {
            if (logsSettings[0].channelID) {
                if (logsSettings[0].activated === "true") {
                    if (logsSettings[0].channeldelete === "true") {
                        if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                            const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                            let embed = new MessageEmbed()
                                .setAuthor('Unknown User')
                                .setDescription(`New **${CHANNEL_TYPES[channel.type]}** deleted (**${channel.name}**)`)
                                .addField("Deleted by", `Unknown`, true)
                                .addField("Channel ID", channel.id, true)
                                .setColor("RANDOM")

                            if (channel.permissionOverwrites.size !== 0) {
                                channel.permissionOverwrites.forEach(overwrite => {

                                    if (overwrite.type === "role") {
                                        const role = channel.guild.roles.cache.find(r => r.id === overwrite.id);
                                        if (role.name === "@everyone") return;
                                        embed.fields.push({
                                            name: `Channel Permissions Overwrite:\n${role.name}`,
                                            value: `Type: role\nAllowed Permissions: ${overwrite.allow.toArray().length >= 1 ? overwrite.allow.toArray().join(', ') : "None"}\nDenied Permissions: ${overwrite.deny.toArray().length >= 1 ? overwrite.deny.toArray().join(', ') : "None"}`
                                        })
                                    }
                                })
                            }

                            await setTimeout(async () => {
                                const logs = await channel.guild.fetchAuditLogs({ limit: 5, type: 12}).catch(() => {return});
                                if (!logs) return;

                                const log = logs.entries.first()
                                const user = channel.guild.members.cache.get(log.executor.id);
                                const member = channel.guild.members.cache.get(user.id);

                                if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                    embed.author.name = `${member.user.username}#${member.user.discriminator} ${member.nick ? `(${member.nick})` : ''}`
                                    embed.author.iconURL = `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`;
                                    embed.fields[0].value = user

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