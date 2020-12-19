const {
    WebhookClient,
    MessageEmbed
} = require("discord.js");
const CHANNEL_TYPES = {
    'fr': {
        'text': 'Salon Textuel',
        'voice': 'Salon Vocal',
        'category': 'Catégorie'
    },
    'en': {
        'text': 'Text Channel',
        'voice': 'Voice Channel',
        'category': 'Category'
    }
}

module.exports = async (bot, channel) => {
    if (channel.type === "dm") return;

    bot.db.query(`SELECT * FROM Logs WHERE guildID='${channel.guild.id}'`, async (err, logsSettings) => {
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${channel.guild.id}'`, async (err, rows) => {
            let {
                CHANNELDELETE: lang
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`).EVENTS;
            let {
                code
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`)

            if (logsSettings[0]) {
                if (logsSettings[0].channelID) {
                    if (logsSettings[0].activated === "true") {
                        if (logsSettings[0].channeldelete === "true") {
                            if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                                let embed = new MessageEmbed()
                                    .setAuthor(lang.unknownUser)
                                    .setDescription(lang.deleted(CHANNEL_TYPES[code][channel.type], channel))
                                    .addField(lang.deletedBy, lang.unknownUser, true)
                                    .addField(lang.channelID, channel.id, true)
                                    .setColor("RANDOM")
                                    .setTimestamp();

                                await setTimeout(async () => {
                                    const logs = await channel.guild.fetchAuditLogs({
                                        limit: 5,
                                        type: 12
                                    }).catch(() => {
                                        return
                                    });
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
    })
}