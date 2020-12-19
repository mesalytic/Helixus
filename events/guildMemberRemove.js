const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

const moment = require('moment');

module.exports = async (bot, member) => {
    bot.db.query(`SELECT * FROM LeaveMessages WHERE guildID='${member.guild.id}'`, (err, rows) => {
        if (err) throw err;
        if (rows[0]) {
            let chan = member.guild.channels.cache.get(rows[0].channelID);
            chan.send(rows[0].leavemsg.replace(/{user}/g, member).replace(/{username}/g, member.user.username).replace(/{server}/g, member.guild.name));
        }
    })

    bot.db.query(`SELECT * FROM Logs WHERE guildID='${member.guild.id}'`, async (err, logsSettings) => {
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${member.guild.id}'`, async (err, rows) => {
            let {
                GUILDMEMBERREMOVE: lang
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`).EVENTS;
            if (logsSettings[0]) {
                if (logsSettings[0].channelID) {
                    if (logsSettings[0].activated = "true") {
                        if (logsSettings[0].guildmemberremove === "true") {
                            if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                                if (!member.createdAt) {
                                    member.id = lang.unknown
                                    member.username = lang.unknown
                                    member.discriminator = lang.unknown
                                }

                                let roles = [];
                                if (member.roles) {
                                    member.roles.cache.forEach(roleID => {
                                        const role = member.guild.roles.cache.find(r => r.id === roleID)
                                        if (role) roles.push(role);
                                    })
                                }

                                const rolesField = {
                                    name: 'Roles',
                                    value: roles.length === 0 ? lang.none : roles.map(r => r.name).join(', ')
                                }

                                if (!rolesField.value) rolesField.value = lang.none;
                                if (!member.username) {
                                    let embed = new MessageEmbed()
                                        .setColor("RANDOM")
                                        .setAuthor(lang.lurker, 'https://images.emojiterra.com/twitter/512px/1f440.png')
                                        .setDescription(lang.lurkerLeft)
                                }

                                await setTimeout(async () => {
                                    let logs = await member.guild.fetchAuditLogs({
                                        limit: 5,
                                        type: 20
                                    }).catch(() => {})
                                    if (!logs) return;

                                    let log = logs.entries.first();

                                    if (log && new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                        let executor = member.guild.members.cache.get(log.executor.id);

                                        let embed = new MessageEmbed()
                                            .setColor("RANDOM")
                                            .setAuthor(`${member.user.username}#${member.user.discriminator}`, `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=512`)
                                            .setDescription(lang.kicked(member))
                                            .addField(lang.userInfos, `ID: **${member.id}**${member.bot ? lang.isBot : ''}`)
                                            .addField(rolesField.name, rolesField.value)
                                            .addField(lang.reason, log.reason ? log.reason : lang.none)
                                            .setFooter(`${executor.user.username}#${executor.user.discriminator}`, `https://cdn.discordapp.com/avatars/${executor.user.id}/${executor.user.avatar}.png?size=512`)
                                            .setTimestamp();

                                        webhook.send(embed);
                                    } else {
                                        let embed = new MessageEmbed()
                                            .setColor("RANDOM")
                                            .setAuthor(`${member.user.username}#${member.user.discriminator}`, `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`)
                                            .setDescription(lang.left(member))
                                            .addField(lang.userInfos, `ID: **${member.id}**${member.bot ? lang.isBot : ''}`)
                                            .addField(rolesField.name, rolesField.value)
                                            .setFooter(`${member.user.username}#${member.user.discriminator}`, `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`)
                                            .setTimestamp();

                                        webhook.send(embed);
                                    }
                                })
                            }
                        }
                    }
                }
            }
        })
    })
}