const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

const states = {
    'fr': {
        mute: {
            "true": "Muet",
            "false": "Non Muet"
        },
        deaf: {
            "true": "Sourd",
            "false": "Non Sourd"
        },
    },
    'en': {
        mute: {
            "true": "Muted",
            "false": "Not muted"
        },
        deaf: {
            "true": "Deafened",
            "false": "Not deafened"
        },
    }
}

module.exports = async (bot, oldState, newState) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${newState.guild.id}'`, async (err, logsSettings) => {
        if (err) throw err;
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${role.guild.id}'`, async (err, rows) => {
            let {
                ROLECREATE: lang
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`).EVENTS;
            let {
                code
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`)
            if (logsSettings[0]) {
                if (logsSettings[0].channelID) {
                    if (logsSettings[0].activated = "true") {
                        if (logsSettings[0].voicestateupdate === "true") {

                            if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                                if (!oldState.channel && newState.channel) {
                                    let embed = new MessageEmbed()
                                        .setAuthor(newState.member.user.tag, newState.member.user.avatarURL())
                                        .setDescription(lang.joined(newState.member, newState.channel))
                                        .setColor("RANDOM")
                                        .setTimestamp();

                                    webhook.send(embed);
                                } else if ((oldState.channel && newState.channel) && ((oldState.deaf === newState.deaf) && (oldState.mute === newState.mute))) {
                                    let embed = new MessageEmbed()
                                        .setAuthor(newState.member.user.tag, newState.member.user.avatarURL())
                                        .setDescription(lang.switch(newState.member, newState.channel, oldState.channel))
                                        .setColor("RANDOM")
                                        .setTimestamp();

                                    webhook.send(embed);
                                } else if (oldState.channel && !newState.channel) {
                                    let embed = new MessageEmbed()
                                        .setAuthor(newState.member.user.tag, newState.member.user.avatarURL())
                                        .setDescription(lang.left(newState.member, oldState.channel))
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
                                        .setDescription(lang.updated(newState))
                                        .addField(lang.voiceChannel, `${newState.channel.name} (${newState.channelID})`)
                                        .setColor("RANDOM")

                                    if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                        embed.addField(`${toTitleCase(log.changes[0].key)}`, lang.states(states[code][log.changes[0].key][log.changes[0].old], states[code][log.changes[0].key][log.changes[0].new])`Was: ${}\nNow: ${}`)
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
    })
}