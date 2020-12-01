const {
    replaceResultTransformer
} = require("common-tags");
const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

const states = {
    mute: {
        "true": "Muted",
        "false": "Not muted"
    },
    deaf: {
        "true": "Deafened",
        "false": "Not deafened"
    },
}

const hastebin = require("hastebin-gen");

module.exports = async (bot, oldState, newState) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${newState.guild.id}'`, async (err, logsSettings) => {
        if (err) throw err;
        if (logsSettings[0]) {
            if (logsSettings[0].channelID) {
                if (logsSettings[0].activated = "true") {
                    if (logsSettings[0].voicestates === "true") {

                        if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                            const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                            if (!oldState.channel && newState.channel) {
                                let embed = new MessageEmbed()
                                    .setAuthor(newState.member.user.tag, newState.member.user.avatarURL())
                                    .setDescription(`${newState.member} **__joined__ ${newState.channel.name}**`)
                                    .setColor("RANDOM")
                                    .setTimestamp();

                                webhook.send(embed);
                            } else if ((oldState.channel && newState.channel) && ((oldState.deaf === newState.deaf) && (oldState.mute === newState.mute))) {
                                let embed = new MessageEmbed()
                                    .setAuthor(newState.member.user.tag, newState.member.user.avatarURL())
                                    .setDescription(`${newState.member} **__joined__ ${newState.channel.name}** and **__left__ ${oldState.channel.name}**.`)
                                    .setColor("RANDOM")
                                    .setTimestamp();

                                webhook.send(embed);
                            } else if (oldState.channel && !newState.channel) {
                                let embed = new MessageEmbed()
                                    .setAuthor(newState.member.user.tag, newState.member.user.avatarURL())
                                    .setDescription(`${newState.member} **__left__ ${oldState.channel.name}**`)
                                    .setColor("RANDOM")
                                    .setTimestamp();

                                webhook.send(embed);
                            }

                            if (!newState.channel || !oldState.channel) return;


                            await setTimeout(async () => {
                                const logs = await newState.member.guild.fetchAuditLogs({
                                    limit: 5,
                                    type: 24
                                }).catch(() => {
                                    return
                                });
                                if (!logs) return;



                                const log = logs.entries.find(e => e.target.id === newState.member.id);

                                if (!log || !log.changes[0] || !["deaf", "mute"].includes(log.changes[0].key)) return;
                                const embed = new MessageEmbed()
                                    .setAuthor(`${newState.member.user.username}#${newState.member.user.discriminator}`, newState.member.user.avatarURL())
                                    .setDescription(`**${newState.member.user.username}#${newState.member.user.discriminator}** (${newState.member.id}) had their voice state updated.`)
                                    .addField("Voice Channel", `${newState.channel.name} (${newState.channelID})`)
                                    .setColor("RANDOM")

                                if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                    embed.addField(`${toTitleCase(log.changes[0].key)}`, `Was: ${states[log.changes[0].key][log.changes[0].old]}\nNow: ${states[log.changes[0].key][log.changes[0].new]}`)
                                    webhook.send(embed)
                                } else {
                                    webhook.send(embed)
                                }
                            }, 1000)

                            function toTitleCase(str) {
                                return str.replace(/\w\S*/g, function (txt) {
                                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                                })
                            }

                        }
                    }
                }
            }
        }
    })
}